import { computed, Injectable, Signal, signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

import { DeviationAlert } from '../domain/model/deviation-alert.entity';
import { ComplianceEvent } from '../domain/model/compliance-event.entity';
import { NotificationPreference } from '../domain/model/notification-preference.entity';
import { CaApi } from '../infrastructure/ca-api';
import { UpdateNotificationPreferenceRequest } from '../infrastructure/notification-preference.request';

/**
 * Application store for managing Compliance and Alerts (CA) state.
 *
 * @remarks
 * This store acts as the central state management for the CA domain, using Angular Signals
 * for reactive data flow. It encapsulates business logic for the application layer,
 * coordinating between the infrastructure layer (API) and the presentation layer (Components).
 *
 * It manages state for:
 * - Deviation alerts and their statistics.
 * - Compliance audit events.
 * - User notification preferences.
 */
@Injectable({ providedIn: 'root' })
export class CaStore {
  // Private signals for internal state management
  private readonly _alertsSignal = signal<DeviationAlert[]>([]);
  private readonly _eventsSignal = signal<ComplianceEvent[]>([]);
  private readonly _preferenceSignal = signal<NotificationPreference | null>(null);

  private readonly _loadingSignal = signal<boolean>(false);
  private readonly _errorSignal = signal<string | null>(null);

  /**
   * Read-only signal providing the current list of deviation alerts.
   */
  readonly alerts = this._alertsSignal.asReadonly();

  /**
   * Read-only signal providing the current list of compliance audit events.
   */
  readonly complianceEvents = this._eventsSignal.asReadonly();

  /**
   * Read-only signal providing the current user notification preferences.
   */
  readonly preference = this._preferenceSignal.asReadonly();

  /**
   * Read-only signal indicating if an asynchronous operation is in progress.
   */
  readonly loading = this._loadingSignal.asReadonly();

  /**
   * Read-only signal containing the current error message, if any.
   */
  readonly error = this._errorSignal.asReadonly();

  /**
   * Computed signal for the total number of alerts in the store.
   */
  readonly alertsCount = computed(() => this.alerts().length);

  /**
   * Computed signal for the count of alerts with 'UNRESOLVED' status.
   */
  readonly unresolvedAlertsCount = computed(
    () => this.alerts().filter((alert) => alert.status === 'UNRESOLVED').length,
  );

  /**
   * Computed signal for the count of alerts classified with 'CRITICAL' severity.
   */
  readonly criticalAlertsCount = computed(
    () => this.alerts().filter((alert) => alert.severity === 'CRITICAL').length,
  );

  private readonly destroyRef = inject(DestroyRef);

  /**
   * Creates an instance of CaStore.
   *
   * @param caApi - Infrastructure service for CA domain API communication.
   */
  constructor(private caApi: CaApi) {}

  /**
   * Retrieves a specific alert by its unique identifier.
   *
   * @param id - The unique identifier of the deviation alert.
   * @returns A computed signal that evaluates to the found alert or undefined.
   */
  getAlertById(id: string): Signal<DeviationAlert | undefined> {
    return computed(() => (id ? this.alerts().find((alert) => alert.id === id) : undefined));
  }

  /**
   * Fetches deviation alerts from the API based on optional filters.
   *
   * @param filters - Optional criteria to filter alerts (equipment, batch, status, severity).
   */
  loadAlerts(filters?: {
    equipmentId?: string;
    batchId?: string;
    status?: string;
    severity?: string;
  }): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);

    this.caApi
      .getAlerts(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (alerts) => {
          this._alertsSignal.set(alerts);
          this._loadingSignal.set(false);
        },
        error: (err) => {
          this._errorSignal.set(this.formatError(err, 'Failed to load deviation alerts'));
          this._loadingSignal.set(false);
        },
      });
  }

  /**
   * Fetches compliance events related to a specific domain entity.
   *
   * @param entityId - The unique identifier of the entity to audit.
   */
  loadComplianceEvents(entityId: string): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);

    this.caApi
      .getEventsByEntity(entityId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (events) => {
          this._eventsSignal.set(events);
          this._loadingSignal.set(false);
        },
        error: (err) => {
          this._errorSignal.set(
            this.formatError(err, `Failed to load events for entity ${entityId}`),
          );
          this._loadingSignal.set(false);
        },
      });
  }

  /**
   * Fetches notification preferences for a specific user.
   *
   * @param userId - The unique identifier of the user.
   */
  loadNotificationPreferences(userId: string): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);

    this.caApi
      .getPreferences(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (preference) => {
          this._preferenceSignal.set(preference);
          this._loadingSignal.set(false);
        },
        error: (err) => {
          this._errorSignal.set(this.formatError(err, 'Failed to load notification preferences'));
          this._loadingSignal.set(false);
        },
      });
  }

  /**
   * Updates notification preferences and refreshes the local state.
   *
   * @param userId - The unique identifier of the user.
   * @param request - DTO containing the updated preference values.
   */
  updateNotificationPreferences(
    userId: string,
    request: UpdateNotificationPreferenceRequest,
  ): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);

    this.caApi
      .updatePreferences(userId, request)
      .pipe(retry(2))
      .subscribe({
        next: (updatedPreference) => {
          this._preferenceSignal.set(updatedPreference);
          this._loadingSignal.set(false);
        },
        error: (err) => {
          this._errorSignal.set(this.formatError(err, 'Failed to update notification preferences'));
          this._loadingSignal.set(false);
        },
      });
  }

  /**
   * Formats API error messages for user-friendly display.
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
