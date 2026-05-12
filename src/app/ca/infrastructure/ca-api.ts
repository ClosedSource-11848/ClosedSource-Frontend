import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';

import { AlertApiEndpoint } from './alert-api-endpoint';
import { ComplianceEventApiEndpoint } from './compliance-event-api-endpoint';
import { NotificationPreferenceApiEndpoint } from './notification-preference-api-endpoint';

import { DeviationAlert } from '../domain/model/deviation-alert.entity';
import { ComplianceEvent } from '../domain/model/compliance-event.entity';
import { NotificationPreference } from '../domain/model/notification-preference.entity';
import { UpdateNotificationPreferenceRequest } from './notification-preference.request';

/**
 * Infrastructure service facade for Compliance and Alerts (CA) external API operations.
 *
 * @remarks
 * In Domain-Driven Design, this service acts as the infrastructure layer facade
 * coordinating access to Compliance-related API resources through HTTP endpoints.
 * It orchestrates interactions between the application layer and the underlying
 * infrastructure endpoints for alerts, events, and user preferences.
 *
 * The CaApi abstracts away the complexity of managing multiple endpoints,
 * providing a unified interface for application services to interact with
 * the compliance domain data.
 *
 * @example
 * ```typescript
 * constructor(private caApi: CaApi) {}
 *
 * loadAlerts() {
 *    this.caApi.getAlerts({ severity: 'CRITICAL' }).subscribe(alerts => {
 *      // Handle critical alerts
 *    });
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class CaApi extends BaseApi {
  /**
   * Endpoint client for deviation alert operations.
   * @private
   */
  private readonly _alertEndpoint: AlertApiEndpoint;

  /**
   * Endpoint client for compliance event operations.
   * @private
   */
  private readonly _complianceEventEndpoint: ComplianceEventApiEndpoint;

  /**
   * Endpoint client for notification preference operations.
   * @private
   */
  private readonly _preferenceEndpoint: NotificationPreferenceApiEndpoint;

  /**
   * Creates an instance of CaApi.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the API facade with specialized endpoint clients for alerts,
   * compliance events, and notification settings. Each client is responsible
   * for its own resource assembly and HTTP communication.
   */
  constructor(http: HttpClient) {
    super();
    this._alertEndpoint = new AlertApiEndpoint(http);
    this._complianceEventEndpoint = new ComplianceEventApiEndpoint(http);
    this._preferenceEndpoint = new NotificationPreferenceApiEndpoint(http);
  }

  // ── Alerts ───────────────────────────────────────────────────────────

  /**
   * Retrieves deviation alerts based on optional filtering criteria.
   *
   * @param filters - Search criteria such as equipment, batch, status, or severity
   * @returns Observable stream emitting an array of DeviationAlert domain entities
   *
   * @remarks
   * Fetches alerts from the remote manufacturing/quality monitoring system.
   */
  getAlerts(filters?: {
    equipmentId?: string;
    batchId?: string;
    status?: string;
    severity?: string;
  }): Observable<DeviationAlert[]> {
    return this._alertEndpoint.getAlerts(filters);
  }

  // ── Compliance Events ────────────────────────────────────────────────

  /**
   * Retrieves all compliance events associated with a specific entity.
   *
   * @param entityId - The unique identifier of the related entity (e.g., User or Asset)
   * @returns Observable stream emitting an array of ComplianceEvent entities
   *
   * @remarks
   * Accesses the audit trail to retrieve events linked to the provided entity identity.
   */
  getEventsByEntity(entityId: string): Observable<ComplianceEvent[]> {
    return this._complianceEventEndpoint.getEventsByEntity(entityId);
  }

  // ── Notification Preferences ─────────────────────────────────────────

  /**
   * Retrieves the notification configuration for a specific user.
   *
   * @param userId - The unique identifier of the user
   * @returns Observable stream emitting the user's NotificationPreference
   *
   * @remarks
   * Fetches the delivery channel settings and severity thresholds for the user.
   */
  getPreferences(userId: string): Observable<NotificationPreference> {
    return this._preferenceEndpoint.getPreferences(userId);
  }

  /**
   * Updates a user's notification preferences.
   *
   * @param userId - The unique identifier of the user to update
   * @param request - The update data transfer object containing new preference states
   * @returns Observable stream emitting the updated NotificationPreference entity
   *
   * @remarks
   * Persists changes to notification channels (email, SMS, in-app) and severity filters.
   */
  updatePreferences(
    userId: string,
    request: UpdateNotificationPreferenceRequest,
  ): Observable<NotificationPreference> {
    return this._preferenceEndpoint.updatePreferences(userId, request);
  }
}
