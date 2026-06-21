import { Injectable, computed, inject, signal } from '@angular/core';
import { retry } from 'rxjs';
import { TrackingApi } from '../infrastructure/tracking-api';

import { Measurement } from '../domain/model/measurement.entity';
import { EquipmentStatus } from '../domain/model/equipment-status.entity';
import { TelemetryHistoryPoint } from '../domain/model/telemetry-history-point.entity';

/**
 * Application store for managing Tracking and Telemetry state.
 *
 * @remarks
 * This store acts as the central state manager for the Tracking bounded context.
 * It coordinates API calls through the infrastructure facade and exposes
 * reactive Angular signals for measurements, equipment status, historical
 * telemetry, loading state, and UI messages.
 */
@Injectable({ providedIn: 'root' })
export class TrackingStore {
  /**
   * Infrastructure facade used to access Tracking API endpoints.
   */
  private readonly api = inject(TrackingApi);

  /**
   * Internal signal containing the latest telemetry measurements.
   */
  private readonly _measurements = signal<Measurement[]>([]);

  /**
   * Internal signal containing the current telemetry status of the selected equipment.
   */
  private readonly _currentEquipmentStatus = signal<EquipmentStatus | null>(null);

  /**
   * Internal signal containing historical telemetry points.
   */
  private readonly _telemetryHistory = signal<TelemetryHistoryPoint[]>([]);

  /**
   * Internal signal indicating whether a tracking operation is currently loading.
   */
  private readonly _isLoading = signal<boolean>(false);

  /**
   * Internal signal containing the latest error message, if any.
   */
  private readonly _error = signal<string | null>(null);

  /**
   * Internal signal containing the latest success message, if any.
   */
  private readonly _successMsg = signal<string | null>(null);

  /**
   * Readonly signal exposing the latest telemetry measurements.
   */
  readonly measurements = this._measurements.asReadonly();

  /**
   * Readonly signal exposing the current equipment telemetry status.
   */
  readonly currentEquipmentStatus = this._currentEquipmentStatus.asReadonly();

  /**
   * Readonly signal exposing historical telemetry points.
   */
  readonly telemetryHistory = this._telemetryHistory.asReadonly();

  /**
   * Readonly signal exposing the loading state.
   */
  readonly isLoading = this._isLoading.asReadonly();

  /**
   * Readonly signal exposing the current error message.
   */
  readonly error = this._error.asReadonly();

  /**
   * Readonly signal exposing the current success message.
   */
  readonly successMsg = this._successMsg.asReadonly();

  /**
   * Computed signal indicating whether the selected equipment is currently online.
   */
  readonly isEquipmentOnline = computed(() => this._currentEquipmentStatus()?.isOnline ?? false);

  /**
   * Computed signal exposing the current telemetry status of the selected equipment.
   */
  readonly equipmentTelemetryStatus = computed(
    () => this._currentEquipmentStatus()?.currentStatus ?? 'OFFLINE',
  );

  /**
   * Computed signal exposing only historical telemetry points marked as anomalies.
   */
  readonly anomaliesHistory = computed(() =>
    this._telemetryHistory().filter((point) => point.isAnomaly),
  );

  /**
   * Fetches the latest telemetry measurements.
   *
   * @param equipmentId - Optional numeric identifier used to filter measurements by equipment
   *
   * @remarks
   * When an equipment ID is provided, the backend should return only the latest
   * measurements for that specific equipment. This keeps dashboards and charts
   * aligned with the currently selected device.
   */
  loadLatestMeasurements(equipmentId?: number): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.api
      .getLatestMeasurements(equipmentId)
      .pipe(retry(2))
      .subscribe({
        next: (measurements: Measurement[]) => {
          this._measurements.set(measurements);
          this._isLoading.set(false);
        },
        error: (error: unknown) => {
          this._error.set(this.formatError(error, 'Failed to load latest measurements'));
          this._isLoading.set(false);
        },
      });
  }

  /**
   * Fetches the current telemetry status for a specific equipment.
   *
   * @param equipmentId - Numeric identifier of the equipment
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
        error: (error: unknown) => {
          this._error.set(this.formatError(error, 'Failed to load equipment status'));
          this._isLoading.set(false);
        },
      });
  }

  /**
   * Fetches historical telemetry points using optional filters.
   *
   * @param filters - Optional criteria used to filter telemetry history
   * @param filters.equipmentId - Numeric identifier of the equipment
   * @param filters.from - Start timestamp in ISO string format
   * @param filters.to - End timestamp in ISO string format
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
        error: (error: unknown) => {
          this._error.set(this.formatError(error, 'Failed to load telemetry history'));
          this._isLoading.set(false);
        },
      });
  }

  /**
   * Clears active UI messages from the store.
   */
  clearMessages(): void {
    this._error.set(null);
    this._successMsg.set(null);
  }

  /**
   * Converts an unknown error object into a user-facing message.
   *
   * @param error - Error value caught from an Observable subscription
   * @param fallback - Default message used when the error cannot be parsed
   * @returns A formatted error message
   */
  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not Found`
        : error.message;
    }

    return fallback;
  }
}
