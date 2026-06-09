import { Injectable, signal, computed, inject } from '@angular/core';
import { retry } from 'rxjs';
import { EquipmentApi } from '../infrastructure/equipment-api';
import { Equipment } from '../domain/model/equipment.entity';
import { BpmParameterConfig } from '../domain/model/bpm-parameter-config.entity';
import { MaintenanceRecord } from '../domain/model/maintenance-record.entity';
import { RegisterEquipmentCommand } from '../domain/model/register-equipment.command';
import { ConfigureBpmCommand } from '../domain/model/configure-bpm.command';
import { RegisterMaintenanceCommand } from '../domain/model/register-maintenance.command';

/**
 * Store service responsible for managing equipment-related application state.
 *
 * @remarks
 * This store centralizes the state and operations related to equipment,
 * BPM parameter configurations, and maintenance history.
 *
 * It uses Angular signals to manage reactive state, computed selectors to
 * derive filtered equipment lists, and the EquipmentApi service to communicate
 * with the infrastructure layer.
 *
 * The store acts as an application-level state manager between UI components
 * and backend API services, allowing components to consume readonly state
 * without directly modifying internal signals.
 *
 * @example
 * ```typescript
 * const store = inject(EquipmentStore);
 *
 * store.loadEquipment(101);
 *
 * console.log(store.equipmentList());
 * console.log(store.operationalEquipment());
 * ```
 */
@Injectable({ providedIn: 'root' })
export class EquipmentStore {
  /**
   * API facade used to execute equipment, BPM configuration, and maintenance operations.
   *
   * @remarks
   * This dependency is injected using Angular's inject function and provides
   * access to the infrastructure layer through EquipmentApi.
   */
  private readonly api = inject(EquipmentApi);

  // ── State ────────────────────────────────────────────────────────────────

  /**
   * Internal signal that stores the complete list of equipment.
   *
   * @remarks
   * This signal should only be updated inside the store. External consumers
   * should access the readonly version through equipmentList.
   */
  private readonly _equipmentList = signal<Equipment[]>([]);

  /**
   * Internal signal that stores the currently selected equipment.
   *
   * @remarks
   * It can contain an Equipment entity when an item is selected, or null
   * when no equipment has been selected.
   */
  private readonly _selectedEquipment = signal<Equipment | null>(null);

  /**
   * Internal signal that stores BPM parameter configurations.
   *
   * @remarks
   * Each item represents the configured minimum and maximum limits for
   * a specific parameter associated with an equipment.
   */
  private readonly _bpmConfigs = signal<BpmParameterConfig[]>([]);

  /**
   * Internal signal that stores the maintenance history of an equipment.
   *
   * @remarks
   * The list is updated when maintenance history is loaded or when a new
   * maintenance record is registered.
   */
  private readonly _maintenanceHistory = signal<MaintenanceRecord[]>([]);

  /**
   * Internal signal that indicates whether an asynchronous operation is running.
   *
   * @remarks
   * This value is useful for displaying loading indicators in the UI while
   * equipment, BPM configuration, or maintenance operations are being processed.
   */
  private readonly _isLoading = signal<boolean>(false);

  /**
   * Internal signal that stores the current error message.
   *
   * @remarks
   * It contains a string when an operation fails, or null when there is
   * no active error message.
   */
  private readonly _error = signal<string | null>(null);

  /**
   * Internal signal that stores the current success message.
   *
   * @remarks
   * It contains a string after a successful operation, or null when there is
   * no active success message.
   */
  private readonly _successMsg = signal<string | null>(null);

  // ── Selectors (readonly) ─────────────────────────────────────────────────

  /**
   * Readonly selector for the equipment list.
   *
   * @remarks
   * Exposes the equipment list without allowing external components to mutate
   * the internal signal directly.
   */
  readonly equipmentList = this._equipmentList.asReadonly();

  /**
   * Readonly selector for the selected equipment.
   *
   * @remarks
   * Exposes the currently selected equipment to external consumers.
   */
  readonly selectedEquipment = this._selectedEquipment.asReadonly();

  /**
   * Readonly selector for BPM parameter configurations.
   *
   * @remarks
   * Exposes the list of BPM configurations associated with equipment.
   */
  readonly bpmConfigs = this._bpmConfigs.asReadonly();

  /**
   * Readonly selector for maintenance history.
   *
   * @remarks
   * Exposes the list of maintenance records associated with equipment.
   */
  readonly maintenanceHistory = this._maintenanceHistory.asReadonly();

  /**
   * Readonly selector for the loading state.
   *
   * @remarks
   * Components can use this selector to reactively display or hide loading
   * indicators.
   */
  readonly isLoading = this._isLoading.asReadonly();

  /**
   * Readonly selector for the current error message.
   *
   * @remarks
   * Components can use this selector to show operation errors to the user.
   */
  readonly error = this._error.asReadonly();

  /**
   * Readonly selector for the current success message.
   *
   * @remarks
   * Components can use this selector to show successful operation feedback
   * to the user.
   */
  readonly successMsg = this._successMsg.asReadonly();

  // Selectores Computados

  /**
   * Computed selector that returns only operational equipment.
   *
   * @returns A filtered list of equipment with OPERATIONAL status.
   *
   * @remarks
   * This selector derives its value from the equipment list and updates
   * automatically whenever the internal equipment list changes.
   */
  readonly operationalEquipment = computed(() =>
    this._equipmentList().filter((e) => e.status === 'OPERATIONAL'),
  );

  /**
   * Computed selector that returns equipment requiring maintenance or calibration.
   *
   * @returns A filtered list of equipment with MAINTENANCE or CALIBRATION_REQUIRED status.
   *
   * @remarks
   * This selector is useful for identifying equipment that should not be treated
   * as fully operational and may require technical attention.
   */
  readonly needsMaintenance = computed(() =>
    this._equipmentList().filter(
      (e) => e.status === 'MAINTENANCE' || e.status === 'OUT_OF_SERVICE',
    ),
  );

  // ── Equipment CRUD ───────────────────────────────────────────────────────

  /**
   * Loads the equipment registered in a specific laboratory.
   *
   * @param labId - The numeric identifier of the laboratory whose equipment will be loaded.
   *
   * @remarks
   * This method sets the loading state, clears previous errors, requests the
   * equipment list from the API, and updates the internal equipment list signal
   * when the request succeeds.
   *
   * The request is retried up to two times before handling the error.
   */
  loadEquipment(labId: number): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .getEquipment(labId)
      .pipe(retry(2))
      .subscribe({
        next: (equipment: Equipment[]) => {
          this._equipmentList.set(equipment);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load equipment list'));
          this._isLoading.set(false);
        },
      });
  }

  /**
   * Registers a new equipment and updates the equipment list state.
   *
   * @param command - The command containing the required equipment registration data.
   *
   * @remarks
   * This method sends the registration command to the API and, when successful,
   * appends the returned Equipment entity to the current equipment list.
   *
   * It also sets a success message after the equipment is registered.
   * The request is retried up to two times before handling the error.
   */
  registerEquipment(command: RegisterEquipmentCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .registerEquipment(command as any)
      .pipe(retry(2))
      .subscribe({
        next: (equipment: Equipment) => {
          this._equipmentList.update((list) => [...list, equipment]);
          this._successMsg.set('Equipment registered successfully');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to register equipment'));
          this._isLoading.set(false);
        },
      });
  }

  // ── BPM Configuration ────────────────────────────────────────────────────

  /**
   * Loads BPM parameter configurations for a specific equipment.
   *
   * @param equipmentId - The numeric identifier of the equipment whose BPM configurations will be loaded.
   *
   * @remarks
   * This method retrieves the configured parameter ranges associated with
   * the provided equipment identifier and updates the BPM configuration state.
   *
   * The request is retried up to two times before handling the error.
   */
  loadBpmConfig(equipmentId: number): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .getBpmConfig(equipmentId)
      .pipe(retry(2))
      .subscribe({
        next: (configs: BpmParameterConfig[]) => {
          this._bpmConfigs.set(configs);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load BPM configurations'));
          this._isLoading.set(false);
        },
      });
  }

  /**
   * Configures a BPM parameter for an equipment.
   *
   * @param command - The command containing the BPM parameter configuration data.
   *
   * @remarks
   * This method sends the BPM configuration command to the API and, when
   * successful, appends the returned BpmParameterConfig entity to the current
   * BPM configuration list.
   *
   * It also sets a success message after the parameter is configured.
   * The request is retried up to two times before handling the error.
   */
  configureBpm(command: ConfigureBpmCommand): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.api
      .configureBpm(command as any)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this.loadBpmConfig(command.equipmentId);
          this._successMsg.set('BPM parameter configured successfully');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to configure BPM parameter'));
          this._isLoading.set(false);
        },
      });
  }

  // ── Maintenance ──────────────────────────────────────────────────────────

  /**
   * Loads the maintenance history for a specific equipment.
   *
   * @param equipmentId - The numeric identifier of the equipment whose maintenance history will be loaded.
   *
   * @remarks
   * This method retrieves all maintenance records associated with the provided
   * equipment identifier and updates the maintenance history state.
   *
   * The request is retried up to two times before handling the error.
   */
  loadMaintenanceHistory(equipmentId: number): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .getMaintenanceHistory(equipmentId)
      .pipe(retry(2))
      .subscribe({
        next: (history: MaintenanceRecord[]) => {
          this._maintenanceHistory.set(history);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load maintenance history'));
          this._isLoading.set(false);
        },
      });
  }

  /**
   * Registers a maintenance record for an equipment.
   *
   * @param command - The command containing the maintenance registration data.
   *
   * @remarks
   * This method sends the maintenance registration command to the API and,
   * when successful, appends the returned MaintenanceRecord entity to the
   * current maintenance history list.
   *
   * It also sets a success message after the maintenance record is registered.
   * The request is retried up to two times before handling the error.
   */
  registerMaintenance(command: RegisterMaintenanceCommand): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.api
      .registerMaintenance(command as any)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this.loadMaintenanceHistory(command.equipmentId);
          this._successMsg.set('Maintenance record registered successfully');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to register maintenance'));
          this._isLoading.set(false);
        },
      });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Clears active error and success messages.
   *
   * @remarks
   * This method resets the message-related state and is commonly used after
   * displaying feedback to the user or when starting a new operation.
   */
  clearMessages(): void {
    this._error.set(null);
    this._successMsg.set(null);
  }

  /**
   * Formats an error object into a readable message.
   *
   * @param error - The received error object.
   * @param fallback - The fallback message used when the error cannot be interpreted.
   * @returns A readable error message.
   *
   * @remarks
   * If the received error is an Error instance, this method checks whether
   * it contains a resource not found message and formats it with the provided
   * fallback text. Otherwise, it returns the original error message or the
   * fallback message.
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
