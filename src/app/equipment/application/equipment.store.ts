import { Injectable, signal, computed, inject } from '@angular/core';
import { retry } from 'rxjs';
import { EquipmentApi } from '../infrastructure/equipment-api';
import { Equipment } from '../domain/model/equipment.entity';
import { BpmParameterConfig } from '../domain/model/bpm-parameter-config.entity';
import { MaintenanceRecord } from '../domain/model/maintenance-record.entity';
import { RegisterEquipmentCommand } from '../domain/model/register-equipment.command';
import { ConfigureBpmCommand } from '../domain/model/configure-bpm.command';
import { RegisterMaintenanceCommand } from '../domain/model/register-maintenance.command';

@Injectable({ providedIn: 'root' })
export class EquipmentStore {
  private readonly api = inject(EquipmentApi);

  // ── State ────────────────────────────────────────────────────────────────
  private readonly _equipmentList = signal<Equipment[]>([]);
  private readonly _selectedEquipment = signal<Equipment | null>(null);
  private readonly _bpmConfigs = signal<BpmParameterConfig[]>([]);
  private readonly _maintenanceHistory = signal<MaintenanceRecord[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _successMsg = signal<string | null>(null);

  // ── Selectors (readonly) ─────────────────────────────────────────────────
  readonly equipmentList = this._equipmentList.asReadonly();
  readonly selectedEquipment = this._selectedEquipment.asReadonly();
  readonly bpmConfigs = this._bpmConfigs.asReadonly();
  readonly maintenanceHistory = this._maintenanceHistory.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly successMsg = this._successMsg.asReadonly();

  // Selectores Computados
  readonly operationalEquipment = computed(() =>
    this._equipmentList().filter((e) => e.status === 'OPERATIONAL'),
  );
  readonly needsMaintenance = computed(() =>
    this._equipmentList().filter(
      (e) => e.status === 'MAINTENANCE' || e.status === 'CALIBRATION_REQUIRED',
    ),
  );

  // ── Equipment CRUD ───────────────────────────────────────────────────────

  loadEquipment(labId: string): void {
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

  loadBpmConfig(equipmentId: string): void {
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

  configureBpm(command: ConfigureBpmCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .configureBpm(command as any)
      .pipe(retry(2))
      .subscribe({
        next: (config: BpmParameterConfig) => {
          this._bpmConfigs.update((list) => [...list, config]);
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

  loadMaintenanceHistory(equipmentId: string): void {
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

  registerMaintenance(command: RegisterMaintenanceCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .registerMaintenance(command as any)
      .pipe(retry(2))
      .subscribe({
        next: (record: MaintenanceRecord) => {
          this._maintenanceHistory.update((list) => [...list, record]);
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
