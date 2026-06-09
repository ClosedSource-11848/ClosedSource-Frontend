import { Injectable, signal, computed } from '@angular/core';
import { LaboratoryApi } from '../infrastructure/laboratory-api';
import { Laboratory } from '../domain/model/laboratory.entity';
import { StaffMember } from '../domain/model/staff-member.entity';
import { PharmaceuticalProduct } from '../domain/model/pharmaceutical-product.entity';
import { RawMaterial } from '../domain/model/raw-material.entity';
import { UpdateLaboratoryCommand } from '../domain/model/update-laboratory.command';
import { RegisterStaffCommand } from '../domain/model/register-staff.command';
import { CreateProductCommand } from '../domain/model/create-product.command';
import { CreateRawMaterialCommand } from '../domain/model/create-raw-material.command';
import { retry } from 'rxjs';

/**
 * Application-level store for managing the state of the Laboratory bounded context.
 *
 * @remarks
 * In Domain-Driven Design with CQRS patterns, `LaboratoryStore` acts as the state
 * management hub for the Laboratory module, providing a centralized, reactive state
 * container that coordinates interactions between the presentation layer and the
 * infrastructure layer (via {@link LaboratoryApi}).
 *
 * The store manages the lifecycle of laboratory domain entities ({@link Laboratory},
 * {@link StaffMember}, {@link PharmaceuticalProduct}, {@link RawMaterial}) and
 * maintains UI-relevant state flags (loading, errors, success messages).
 *
 * **State Management Strategy:**
 * - Uses Angular signals for fine-grained reactivity
 * - Exposes state as read-only signals for safe consumption by components
 * - Provides computed signals for derived state (e.g., `hasLowStock`, `activeStaff`)
 * - Manages operation side effects (loading, error handling, retry logic)
 *
 * **Integration Points:**
 * - Consumes commands from the domain layer according to CQRS principles
 * - Delegates API communication to {@link LaboratoryApi}
 * - Provides feedback via loading, error, and success message signals
 *
 * @example
 * ```typescript
 * @Component({ ... })
 * export class LabProfileComponent {
 * private readonly store = inject(LaboratoryStore);
 *
 * ngOnInit() {
 * this.store.loadLaboratory(123);
 * }
 *
 * get laboratory() {
 * return this.store.laboratory();
 * }
 *
 * updateLab() {
 * const command: UpdateLaboratoryCommand = { ... };
 * this.store.updateLaboratory(123, command);
 * }
 * }
 * ```
 *
 * @see {@link LaboratoryApi} for HTTP communication details
 * @see {@link Laboratory} for domain entity structure
 */
@Injectable({ providedIn: 'root' })
export class LaboratoryStore {
  // ── State Signals ────────────────────────────────────────────────────────
  /**
   * The currently loaded laboratory profile.
   * @internal Use the readonly {@link laboratory} selector instead.
   */
  private readonly _laboratory = signal<Laboratory | null>(null);

  /**
   * The list of staff members associated with the current laboratory.
   * @internal Use the readonly {@link staffList} selector instead.
   */
  private readonly _staffList = signal<StaffMember[]>([]);

  /**
   * The list of pharmaceutical products registered under the current laboratory.
   * @internal Use the readonly {@link products} selector instead.
   */
  private readonly _products = signal<PharmaceuticalProduct[]>([]);

  /**
   * The list of raw materials managed by the current laboratory.
   * @internal Use the readonly {@link rawMaterials} selector instead.
   */
  private readonly _rawMaterials = signal<RawMaterial[]>([]);

  /**
   * Low-stock raw materials requiring attention for procurement.
   * @remarks
   * Contains materials where {@link RawMaterial.quantityInStock} is at or below
   * {@link RawMaterial.minimumStock}. Updated when inventory monitoring occurs.
   * @internal Use the readonly {@link lowStock} selector instead.
   */
  private readonly _lowStock = signal<RawMaterial[]>([]);

  /**
   * Indicates whether an API operation is currently in progress.
   * @internal Use the readonly {@link isLoading} selector instead.
   */
  private readonly _isLoading = signal<boolean>(false);

  /**
   * The error message from the most recent failed operation, if any.
   * @remarks
   * Null when no error has occurred or when {@link clearMessages} is called.
   * @internal Use the readonly {@link error} selector instead.
   */
  private readonly _error = signal<string | null>(null);

  /**
   * The success message from the most recent successful operation, if any.
   * @remarks
   * Null when no success message has been generated or when {@link clearMessages} is called.
   * @internal Use the readonly {@link successMsg} selector instead.
   */
  private readonly _successMsg = signal<string | null>(null);

  // ── Public Selectors ─────────────────────────────────────────────────────
  /**
   * Read-only selector for the currently loaded laboratory profile.
   */
  readonly laboratory = this._laboratory.asReadonly();

  /**
   * Read-only selector for the list of staff members.
   */
  readonly staffList = this._staffList.asReadonly();

  /**
   * Read-only selector for the list of pharmaceutical products.
   */
  readonly products = this._products.asReadonly();

  /**
   * Read-only selector for the list of raw materials.
   */
  readonly rawMaterials = this._rawMaterials.asReadonly();

  /**
   * Read-only selector for low-stock raw materials.
   * @see {@link RawMaterial.minimumStock} for threshold definition
   */
  readonly lowStock = this._lowStock.asReadonly();

  /**
   * Read-only selector indicating whether an operation is in progress.
   */
  readonly isLoading = this._isLoading.asReadonly();

  /**
   * Read-only selector for the current error message, if any.
   */
  readonly error = this._error.asReadonly();

  /**
   * Read-only selector for the current success message, if any.
   */
  readonly successMsg = this._successMsg.asReadonly();

  /**
   * Computed selector indicating whether any low-stock materials exist.
   * @returns `true` if the {@link lowStock} list is non-empty, `false` otherwise.
   */
  readonly hasLowStock = computed(() => this._lowStock().length > 0);

  /**
   * Computed selector for staff members with active status.
   * @returns A filtered array of {@link StaffMember} entities from {@link staffList}
   * where {@link StaffMember.active} is `true`.
   */
  readonly activeStaff = computed(() => this._staffList().filter((s) => s.active));

  /**
   * Creates an instance of `LaboratoryStore`.
   *
   * @param api - The {@link LaboratoryApi} service injected by Angular's DI container,
   * used to communicate with the remote API for all laboratory operations.
   */
  constructor(private readonly api: LaboratoryApi) {}

  // ── Laboratory Profile Management ───────────────────────────────────────

  /**
   * Retrieves and loads the laboratory profile into the store's state.
   *
   * @param labId - The unique numeric identifier of the laboratory to load.
   *
   * @remarks
   * - Sets `isLoading` to `true` at the start and `false` upon completion
   * - Clears any previous error before initiating the request
   * - Implements automatic retry logic (2 retries) via the RxJS `retry` operator
   * - On success, updates the {@link laboratory} signal and clears any error messages
   * - On failure, sets the {@link error} signal with a formatted error message
   * - The operation is asynchronous and non-blocking; callers should monitor
   * the {@link isLoading} and {@link error} signals for operation status
   */
  loadLaboratory(labId: number): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .getLaboratory(labId)
      .pipe(retry(2))
      .subscribe({
        next: (lab: Laboratory) => {
          this._laboratory.set(lab);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load laboratory'));
          this._isLoading.set(false);
        },
      });
  }

  /**
   * Updates the laboratory profile with mutable field values.
   *
   * @param labId - The unique numeric identifier of the laboratory to update.
   * @param command - An {@link UpdateLaboratoryCommand} encapsulating the new
   * values for the laboratory's mutable fields (name, address, phone, regulations).
   *
   * @remarks
   * - Sets `isLoading` to `true` at the start and `false` upon completion
   * - Clears any previous error and success message before initiating the request
   * - Implements automatic retry logic (2 retries) via the RxJS `retry` operator
   * - On success:
   * - Updates the {@link laboratory} signal with the server-returned entity
   * - Sets the {@link successMsg} signal to confirm the operation
   * - Clears the {@link error} signal
   * - On failure, sets the {@link error} signal with a formatted error message
   * - The command is mapped internally to the HTTP request structure by
   * {@link LaboratoryApi}
   *
   * @see {@link UpdateLaboratoryCommand} for mutable field constraints
   */
  updateLaboratory(labId: number, command: UpdateLaboratoryCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .updateLaboratory(labId, command as any)
      .pipe(retry(2))
      .subscribe({
        next: (lab: Laboratory) => {
          this._laboratory.set(lab);
          this._successMsg.set('Laboratory updated successfully');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to update laboratory'));
          this._isLoading.set(false);
        },
      });
  }

  // ── Staff Member Management ─────────────────────────────────────────────

  /**
   * Retrieves and loads all staff members associated with a laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory whose staff to retrieve.
   *
   * @remarks
   * - Sets `isLoading` to `true` at the start and `false` upon completion
   * - Clears any previous error before initiating the request
   * - Implements automatic retry logic (2 retries) via the RxJS `retry` operator
   * - On success:
   * - Replaces the {@link staffList} signal with the server-returned list
   * - Includes information about each member's active status (see {@link StaffMember.active})
   * - Clears any error messages
   * - On failure, sets the {@link error} signal with a formatted error message
   * - To obtain only active staff members, use the {@link activeStaff} computed selector
   */
  loadStaff(labId: number): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .getStaff(labId)
      .pipe(retry(2))
      .subscribe({
        next: (staff: StaffMember[]) => {
          this._staffList.set(staff);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load staff'));
          this._isLoading.set(false);
        },
      });
  }

  /**
   * Registers a new staff member under the laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory under which to register the staff member.
   * @param command - A {@link RegisterStaffCommand} encapsulating the staff member's
   * profile information (fullName, role, email). System-generated fields (id, active,
   * createdAt) are assigned by the server.
   *
   * @remarks
   * - Sets `isLoading` to `true` at the start and `false` upon completion
   * - Clears any previous error and success message before initiating the request
   * - Implements automatic retry logic (2 retries) via the RxJS `retry` operator
   * - On success:
   * - Appends the newly created {@link StaffMember} to the {@link staffList}
   * - Sets the {@link successMsg} signal to confirm the operation
   * - Clears the {@link error} signal
   * - On failure, sets the {@link error} signal with a formatted error message
   * - Newly registered staff members are considered active by default
   * (see {@link StaffMember.active})
   *
   * @see {@link RegisterStaffCommand} for required field constraints
   * @see {@link StaffMember.email} for uniqueness requirements
   */
  registerStaff(labId: number, command: RegisterStaffCommand): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.api
      .registerStaff(labId, command as any)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this.loadStaff(labId);
          this._successMsg.set('Staff member registered successfully');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to register staff'));
          this._isLoading.set(false);
        },
      });
  }

  /**
   * Deactivates an existing staff member within a laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory the staff member belongs to.
   * @param staffId - The unique numeric identifier of the staff member to deactivate.
   *
   * @remarks
   * - Sets `isLoading` to `true` at the start and `false` upon completion
   * - Clears any previous error and success message before initiating the request
   * - Implements automatic retry logic (2 retries) via the RxJS `retry` operator
   * - On success:
   * - Updates the matching {@link StaffMember} in {@link staffList} by setting
   * its {@link StaffMember.active} flag to `false`
   * - Sets the {@link successMsg} signal to confirm the operation
   * - Clears the {@link error} signal
   * - On failure, sets the {@link error} signal with a formatted error message
   * - **Important:** Deactivation does NOT delete the record. The staff member's
   * historical information (authorship of audit entries, batch approvals) is
   * retained for traceability and compliance. See {@link StaffMember.active}
   * for details on the semantics of deactivation.
   * - Deactivated staff members are automatically excluded from the
   * {@link activeStaff} computed selector
   */
  deactivateStaff(labId: number, staffId: number): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .deactivateStaff(labId, staffId)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this._staffList.update((list) =>
            list.map((s) => (s.id === staffId ? { ...s, active: false } : s)),
          );
          this._successMsg.set('Staff member deactivated');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to deactivate staff'));
          this._isLoading.set(false);
        },
      });
  }

  // ── Pharmaceutical Product Management ────────────────────────────────────

  /**
   * Retrieves and loads all pharmaceutical products registered under a laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory whose products to retrieve.
   *
   * @remarks
   * - Sets `isLoading` to `true` at the start and `false` upon completion
   * - Clears any previous error before initiating the request
   * - Implements automatic retry logic (2 retries) via the RxJS `retry` operator
   * - On success:
   * - Replaces the {@link products} signal with the server-returned list
   * - Each product includes its active status (see {@link PharmaceuticalProduct.active})
   * - Clears any error messages
   * - On failure, sets the {@link error} signal with a formatted error message
   * - Inactive products are included in the list; the presentation layer should
   * filter them if needed for user-facing operations
   */
  loadProducts(labId: number): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .getProducts(labId)
      .pipe(retry(2))
      .subscribe({
        next: (products: PharmaceuticalProduct[]) => {
          this._products.set(products);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load products'));
          this._isLoading.set(false);
        },
      });
  }

  /**
   * Creates a new pharmaceutical product under the laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory under which to register the product.
   * @param command - A {@link CreateProductCommand} encapsulating the product's
   * information (code, name, description, specifications). System-generated fields
   * (id, active, createdAt) are assigned by the server.
   *
   * @remarks
   * - Sets `isLoading` to `true` at the start and `false` upon completion
   * - Clears any previous error and success message before initiating the request
   * - Implements automatic retry logic (2 retries) via the RxJS `retry` operator
   * - On success:
   * - Appends the newly created {@link PharmaceuticalProduct} to the {@link products} list
   * - Sets the {@link successMsg} signal to confirm the operation
   * - Clears the {@link error} signal
   * - On failure, sets the {@link error} signal with a formatted error message
   * - Newly created products are considered active by default
   * (see {@link PharmaceuticalProduct.active})
   * - The product code must be unique within the laboratory's product catalog
   *
   * @see {@link CreateProductCommand} for required field constraints
   * @see {@link PharmaceuticalProduct.code} for uniqueness requirements
   */
  createProduct(labId: number, command: CreateProductCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .createProduct(labId, command as any)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this.loadProducts(labId);
          this._successMsg.set('Product created successfully');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to create product'));
          this._isLoading.set(false);
        },
      });
  }

  // ── Raw Material Inventory Management ────────────────────────────────────

  /**
   * Retrieves and loads all raw materials and low-stock alerts for a laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory whose inventory to retrieve.
   *
   * @remarks
   * - Sets `isLoading` to `true` at the start and `false` upon completion (for the
   * main materials load; low-stock load runs in parallel)
   * - Clears any previous error before initiating the request
   * - **Dual-load strategy:** This method makes two concurrent API calls:
   * 1. Fetches all raw materials via {@link LaboratoryApi.getRawMaterials}
   * 2. Fetches low-stock materials via {@link LaboratoryApi.getLowStockMaterials}
   * - Implements automatic retry logic (2 retries) for both API calls via the
   * RxJS `retry` operator
   * - On success for main materials load:
   * - Replaces the {@link rawMaterials} signal with the server-returned list
   * - Clears any error messages
   * - On success for low-stock load:
   * - Updates the {@link lowStock} signal with materials requiring attention
   * - Intended to support inventory monitoring workflows (see {@link hasLowStock})
   * - On failure for main load, sets the {@link error} signal
   * - On failure for low-stock load, logs the error without blocking continued
   * operation (as inventory is still visible even if alerts fail to load)
   *
   * @see {@link hasLowStock} for checking if any low-stock conditions exist
   * @see {@link RawMaterial.minimumStock} for threshold definition
   */
  loadRawMaterials(labId: number): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.api
      .getRawMaterials(labId)
      .pipe(retry(2))
      .subscribe({
        next: (materials: RawMaterial[]) => {
          this._rawMaterials.set(materials);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load raw materials'));
          this._isLoading.set(false);
        },
      });

    this.api
      .getLowStockMaterials(labId)
      .pipe(retry(2))
      .subscribe({
        next: (low: RawMaterial[]) => this._lowStock.set(low),
        error: (err: any) => console.error('Failed to load low stock materials', err),
      });
  }

  /**
   * Registers a new raw material entry into the laboratory's inventory.
   *
   * @param labId - The unique numeric identifier of the laboratory under which to register the material.
   * @param command - A {@link CreateRawMaterialCommand} encapsulating the material's
   * information including name, code, supplier, batch number, expiration date, initial
   * stock quantity, unit, and minimum stock threshold. System-generated fields
   * (id, createdAt) are assigned by the server.
   *
   * @remarks
   * - Sets `isLoading` to `true` at the start and `false` upon completion
   * - Clears any previous error and success message before initiating the request
   * - Implements automatic retry logic (2 retries) via the RxJS `retry` operator
   * - On success:
   * - Appends the newly created {@link RawMaterial} to the {@link rawMaterials} list
   * - Sets the {@link successMsg} signal to confirm the operation
   * - Clears the {@link error} signal
   * - On failure, sets the {@link error} signal with a formatted error message
   * - **Inventory Tracking:** The command captures:
   * - Supplier information for supply chain traceability (see {@link RawMaterial.supplier})
   * - Batch number for pharmaceutical traceability (see {@link RawMaterial.batchNumber})
   * - Expiration date to enforce quality control (see {@link RawMaterial.expirationDate})
   * - Minimum stock threshold for restocking alerts (see {@link RawMaterial.minimumStock})
   * - The material code must be unique within the laboratory's catalog
   * - The expiration date must be validated as a future date before registration
   *
   * @see {@link CreateRawMaterialCommand} for required field constraints
   * @see {@link RawMaterial} for the complete domain entity model
   */
  createRawMaterial(labId: number, command: CreateRawMaterialCommand): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.api
      .createRawMaterial(labId, command as any)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this.loadRawMaterials(labId);
          this._successMsg.set('Raw material registered successfully');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to register raw material'));
          this._isLoading.set(false);
        },
      });
  }

  // ── Helper Methods ───────────────────────────────────────────────────────

  /**
   * Clears any error and success messages from the store's state.
   *
   * @remarks
   * - Sets the {@link error} signal to `null`
   * - Sets the {@link successMsg} signal to `null`
   * - Intended to be called by the presentation layer after displaying
   * transient feedback messages (success confirmations, error alerts) to the user
   * - This method does NOT affect other state (loading, entities, etc.)
   *
   * @example
   * ```typescript
   * // Clear messages after user dismisses a snackbar notification
   * onNotificationDismissed() {
   * this.store.clearMessages();
   * }
   * ```
   */
  clearMessages(): void {
    this._error.set(null);
    this._successMsg.set(null);
  }

  /**
   * Formats error objects into human-readable error messages.
   *
   * @param error - The error object from an API call or operation
   * @param fallback - A default message to use if the error cannot be parsed
   * @returns A formatted error message string
   *
   * @remarks
   * - If the error is an `Error` instance:
   * - Checks if the message contains "Resource not found" (404 style)
   * - Returns a composed message combining the fallback context with "Not Found"
   * - Otherwise returns the error's message directly
   * - For non-Error types (e.g., unknown error shapes), returns the fallback message
   * - Used internally by all store methods to consistently format errors before
   * storing them in the {@link _error} signal
   *
   * @private
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not Found`
        : error.message;
    }
    return fallback;
  }
}
