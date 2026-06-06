import { Injectable, signal, computed, inject } from '@angular/core';
import { retry } from 'rxjs';
import { TrackingApi } from '../infrastructure/tracking-api';

import { Measurement } from '../domain/model/measurement.entity';
import { EquipmentStatus } from '../domain/model/equipment-status.entity';
import { TelemetryHistoryPoint } from '../domain/model/telemetry-history-point.entity';

/**
 * Application store for managing Tracking and Telemetry state.
 *
 * @remarks
 * This store acts as the central state management for the telemetry domain, using
 * Angular Signals for reactive, glitch-free data flow. It coordinates between the
 * infrastructure layer (API) and the presentation layer, handling real-time
 * measurements, equipment health statuses, and historical IoT data.
 */
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

  // ── Computed Selectors (Deriving UI and Chart State) ─────────────────────

  /**
   * Computed signal to quickly determine if the currently tracked equipment is online.
   */
  readonly isEquipmentOnline = computed(() => this._currentEquipmentStatus()?.isOnline ?? false);

  /**
   * Computed signal returning the specific operational state (e.g., 'OPERATIONAL', 'WARNING', 'CRITICAL', 'OFFLINE').
   */
  readonly equipmentTelemetryStatus = computed(
    () => this._currentEquipmentStatus()?.currentStatus ?? 'OFFLINE',
  );

  /**
   * Computed signal that filters the historical telemetry to expose only data points
   * that were identified as anomalies or deviations.
   */
  readonly anomaliesHistory = computed(() =>
    this._telemetryHistory().filter((point) => point.isAnomaly),
  );

  // ── Telemetry & IoT Methods ──────────────────────────────────────────────

  /**
   * Fetches the latest batch of raw telemetry measurements from the system.
   */
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

  /**
   * Fetches the real-time operational status for a specific piece of equipment.
   *
   * @param equipmentId - The unique numeric identifier of the equipment
   */
  loadEquipmentStatus(equipmentId: number): void {
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

  /**
   * Fetches historical telemetry data points based on provided filters.
   *
   * @param filters - Optional criteria to filter the history logs
   * @param filters.equipmentId - Numeric identifier of the specific equipment
   * @param filters.from - Start date and time (ISO string format)
   * @param filters.to - End date and time (ISO string format)
   */
  loadTelemetryHistory(filters?: { equipmentId?: number; from?: string; to?: string }): void {
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

  /**
   * Clears any active error or success messages in the state.
   */
  clearMessages(): void {
    this._error.set(null);
    this._successMsg.set(null);
  }

  /**
   * Formats an error object into a user-friendly string message.
   *
   * @param error - The caught error object
   * @param fallback - A default message to use if specific details aren't available
   * @returns A formatted error string
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
