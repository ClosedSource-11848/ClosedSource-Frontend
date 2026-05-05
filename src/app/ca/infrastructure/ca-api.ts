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

@Injectable({ providedIn: 'root' })
export class CaApi extends BaseApi {
  private readonly _alertEndpoint: AlertApiEndpoint;
  private readonly _complianceEventEndpoint: ComplianceEventApiEndpoint;
  private readonly _preferenceEndpoint: NotificationPreferenceApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this._alertEndpoint = new AlertApiEndpoint(http);
    this._complianceEventEndpoint = new ComplianceEventApiEndpoint(http);
    this._preferenceEndpoint = new NotificationPreferenceApiEndpoint(http);
  }

  // ── Alerts ───────────────────────────────────────────────────────────

  getAlerts(filters?: {
    equipmentId?: string;
    batchId?: string;
    status?: string;
    severity?: string;
  }): Observable<DeviationAlert[]> {
    return this._alertEndpoint.getAlerts(filters);
  }

  // ── Compliance Events ────────────────────────────────────────────────

  getEventsByEntity(entityId: string): Observable<ComplianceEvent[]> {
    return this._complianceEventEndpoint.getEventsByEntity(entityId);
  }

  // ── Notification Preferences ─────────────────────────────────────────

  getPreferences(userId: string): Observable<NotificationPreference> {
    return this._preferenceEndpoint.getPreferences(userId);
  }

  updatePreferences(
    userId: string,
    request: UpdateNotificationPreferenceRequest,
  ): Observable<NotificationPreference> {
    return this._preferenceEndpoint.updatePreferences(userId, request);
  }
}
