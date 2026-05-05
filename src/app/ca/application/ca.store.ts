import { computed, Injectable, Signal, signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

import { DeviationAlert } from '../domain/model/deviation-alert.entity';
import { ComplianceEvent } from '../domain/model/compliance-event.entity';
import { NotificationPreference } from '../domain/model/notification-preference.entity';
import { CaApi } from '../infrastructure/ca-api';
import { UpdateNotificationPreferenceRequest } from '../infrastructure/notification-preference.request';

@Injectable({ providedIn: 'root' })
export class CaStore {
  private readonly _alertsSignal = signal<DeviationAlert[]>([]);
  private readonly _eventsSignal = signal<ComplianceEvent[]>([]);
  private readonly _preferenceSignal = signal<NotificationPreference | null>(null);

  private readonly _loadingSignal = signal<boolean>(false);
  private readonly _errorSignal = signal<string | null>(null);

  readonly alerts = this._alertsSignal.asReadonly();
  readonly complianceEvents = this._eventsSignal.asReadonly();
  readonly preference = this._preferenceSignal.asReadonly();

  readonly loading = this._loadingSignal.asReadonly();
  readonly error = this._errorSignal.asReadonly();

  readonly alertsCount = computed(() => this.alerts().length);
  readonly unresolvedAlertsCount = computed(
    () => this.alerts().filter((alert) => alert.status === 'UNRESOLVED').length,
  );
  readonly criticalAlertsCount = computed(
    () => this.alerts().filter((alert) => alert.severity === 'CRITICAL').length,
  );

  private readonly destroyRef = inject(DestroyRef);

  constructor(private caApi: CaApi) {
  }

  getAlertById(id: string): Signal<DeviationAlert | undefined> {
    return computed(() => (id ? this.alerts().find((alert) => alert.id === id) : undefined));
  }

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

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not Found`
        : error.message;
    }
    return fallback;
  }
}
