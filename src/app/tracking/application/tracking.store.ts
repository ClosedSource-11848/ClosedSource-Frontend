import { Injectable, signal, computed, inject } from '@angular/core';
import { retry } from 'rxjs';
import { TrackingApi } from '../infrastructure/tracking-api';

import { Measurement } from '../domain/model/measurement.entity';
import { EquipmentStatus } from '../domain/model/equipment-status.entity';
import { TelemetryHistoryPoint } from '../domain/model/telemetry-history-point.entity';

@Injectable({ providedIn: 'root' })
export class TrackingStore {
  private readonly api = inject(TrackingApi);

  // ── State ────────────────────────────────────────────────────────────────
  private readonly _measurements = signal<Measurement[]>([]);
  private readonly _currentEquipmentStatus = signal<EquipmentStatus | null>(null);
  private readonly _telemetryHistory = signal<TelemetryHistoryPoint[]>([]);

  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _successMsg = signal<string | null>(null);

  // ── Selectors (readonly) ─────────────────────────────────────────────────
  readonly measurements = this._measurements.asReadonly();
  readonly currentEquipmentStatus = this._currentEquipmentStatus.asReadonly();
  readonly telemetryHistory = this._telemetryHistory.asReadonly();

  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly successMsg = this._successMsg.asReadonly();

  // ── Selectores Computados (Derivando estado para la UI y Gráficos) ───────

  // Saber rápidamente si el equipo está en línea
  readonly isEquipmentOnline = computed(() => this._currentEquipmentStatus()?.isOnline ?? false);

  // Obtener el estado actual ('OPERATIONAL', 'WARNING', 'CRITICAL', 'OFFLINE')
  readonly equipmentTelemetryStatus = computed(
    () => this._currentEquipmentStatus()?.currentStatus ?? 'OFFLINE',
  );

  // Filtrar el historial para obtener solo los puntos que generaron desviaciones (anomalías)
  readonly anomaliesHistory = computed(() =>
    this._telemetryHistory().filter((point) => point.isAnomaly),
  );

  // ── Telemetry & IoT Methods ──────────────────────────────────────────────

  loadLatestMeasurements(): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .getLatestMeasurements()
      .pipe(retry(2))
      .subscribe({
        next: (measurements: Measurement[]) => {
          this._measurements.set(measurements);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load latest measurements'));
          this._isLoading.set(false);
        },
      });
  }

  loadEquipmentStatus(equipmentId: string): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .getEquipmentStatus(equipmentId)
      .pipe(retry(2))
      .subscribe({
        next: (status: EquipmentStatus) => {
          this._currentEquipmentStatus.set(status);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load equipment status'));
          this._isLoading.set(false);
        },
      });
  }

  loadTelemetryHistory(filters?: { equipmentId?: string; from?: string; to?: string }): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .getTelemetryHistory(filters)
      .pipe(retry(2))
      .subscribe({
        next: (history: TelemetryHistoryPoint[]) => {
          this._telemetryHistory.set(history);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load telemetry history'));
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
