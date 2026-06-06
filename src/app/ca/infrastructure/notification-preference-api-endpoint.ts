import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { NotificationPreference } from '../domain/model/notification-preference.entity';
import {
  NotificationPreferenceResource,
  NotificationPreferencesResponse,
} from './notification-preference-response';
import { NotificationPreferenceAssembler } from './notification-preference-assembler';
import { UpdateNotificationPreferenceRequest } from './notification-preference.request';

const prefsEndpointUrl = `${environment.serverBasePath}${environment.caNotificationPrefsEndpointPath}`;

/**
 * HTTP endpoint client for notification preference operations.
 *
 * @remarks
 * This endpoint encapsulates all HTTP communication for the NotificationPreference
 * entity within the Communication/Compliance domain. It extends {@link BaseApiEndpoint}
 * to inherit standard CRUD behavior with preference-specific configuration.
 *
 * The endpoint handles:
 * - GET /preferences/:userId - Retrieve notification settings for a user
 * - PUT /preferences/:userId - Update notification settings for a user
 *
 * Resource conversion is delegated to {@link NotificationPreferenceAssembler}.
 *
 * @example
 * ```typescript
 * const endpoint = new NotificationPreferenceApiEndpoint(http);
 * endpoint.getPreferences(789).subscribe(prefs => {
 * // prefs is a fully hydrated NotificationPreference domain entity
 * });
 * ```
 */
export class NotificationPreferenceApiEndpoint extends BaseApiEndpoint<
  NotificationPreference,
  NotificationPreferenceResource,
  NotificationPreferencesResponse,
  NotificationPreferenceAssembler
> {
  /**
   * Creates an instance of NotificationPreferenceApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the endpoint with the server base path and the notification
   * preferences path. The NotificationPreferenceAssembler is used to bridge
   * the gap between API resources and domain entities.
   */
  constructor(http: HttpClient) {
    super(http, prefsEndpointUrl, new NotificationPreferenceAssembler());
  }

  /**
   * Retrieves the notification preferences for a specific user.
   *
   * @param userId - The unique numeric identifier of the user
   * @returns Observable stream emitting the NotificationPreference domain entity
   *
   * @remarks
   * Fetches the user's specific configuration for communication channels
   * and alert severity thresholds.
   */
  getPreferences(userId: number): Observable<NotificationPreference> {
    return this.http.get<NotificationPreferenceResource>(`${this.endpointUrl}/${userId}`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to fetch notification preferences for user ${userId}`)),
    );
  }

  /**
   * Updates an existing user's notification preferences.
   *
   * @param userId - The unique numeric identifier of the user to update
   * @param request - The DTO containing the updated preference values
   * @returns Observable stream emitting the updated NotificationPreference entity
   *
   * @remarks
   * Sends a PUT request to persist changes in the user's notification settings.
   * The response resource is automatically assembled back into a domain entity.
   */
  updatePreferences(
    userId: number,
    request: UpdateNotificationPreferenceRequest,
  ): Observable<NotificationPreference> {
    return this.http
      .put<NotificationPreferenceResource>(`${this.endpointUrl}/${userId}`, request)
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to update notification preferences')),
      );
  }
}
