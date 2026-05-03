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

@Injectable({ providedIn: 'root' })
export class LaboratoryStore {
  // ── State ────────────────────────────────────────────────────────────────
  private readonly _laboratory = signal<Laboratory | null>(null);
  private readonly _staffList = signal<StaffMember[]>([]);
  private readonly _products = signal<PharmaceuticalProduct[]>([]);
  private readonly _rawMaterials = signal<RawMaterial[]>([]);
  private readonly _lowStock = signal<RawMaterial[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _successMsg = signal<string | null>(null);

  // ── Selectors (readonly) ─────────────────────────────────────────────────
  readonly laboratory = this._laboratory.asReadonly();
  readonly staffList = this._staffList.asReadonly();
  readonly products = this._products.asReadonly();
  readonly rawMaterials = this._rawMaterials.asReadonly();
  readonly lowStock = this._lowStock.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly successMsg = this._successMsg.asReadonly();

  readonly hasLowStock = computed(() => this._lowStock().length > 0);
  readonly activeStaff = computed(() => this._staffList().filter((s) => s.active));

  constructor(private readonly api: LaboratoryApi) {}

  // ── Laboratory ───────────────────────────────────────────────────────────

  loadLaboratory(labId: string): void {
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

  updateLaboratory(labId: string, command: UpdateLaboratoryCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    // Nota: Asegúrate de que UpdateLaboratoryCommand sea compatible con UpdateLaboratoryRequest
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

  // ── Staff ────────────────────────────────────────────────────────────────

  loadStaff(labId: string): void {
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

  registerStaff(labId: string, command: RegisterStaffCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .registerStaff(labId, command as any)
      .pipe(retry(2))
      .subscribe({
        next: (member: StaffMember) => {
          this._staffList.update((list) => [...list, member]);
          this._successMsg.set('Staff member registered successfully');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to register staff'));
          this._isLoading.set(false);
        },
      });
  }

  deactivateStaff(labId: string, staffId: string): void {
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

  // ── Products ─────────────────────────────────────────────────────────────

  loadProducts(labId: string): void {
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

  createProduct(labId: string, command: CreateProductCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .createProduct(labId, command as any)
      .pipe(retry(2))
      .subscribe({
        next: (product: PharmaceuticalProduct) => {
          this._products.update((list) => [...list, product]);
          this._successMsg.set('Product created successfully');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to create product'));
          this._isLoading.set(false);
        },
      });
  }

  // ── Raw Materials ────────────────────────────────────────────────────────

  loadRawMaterials(labId: string): void {
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

  createRawMaterial(labId: string, command: CreateRawMaterialCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .createRawMaterial(labId, command as any)
      .pipe(retry(2))
      .subscribe({
        next: (material: RawMaterial) => {
          this._rawMaterials.update((list) => [...list, material]);
          this._successMsg.set('Raw material registered successfully');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to register raw material'));
          this._isLoading.set(false);
        },
      });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  clearMessages(): void {
    this._error.set(null);
    this._successMsg.set(null);
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not Found`
        : error.message;
    }
    return fallback;
  }
}
