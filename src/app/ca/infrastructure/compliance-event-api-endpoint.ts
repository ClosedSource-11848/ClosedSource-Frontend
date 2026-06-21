import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { ComplianceEvent } from '../domain/model/compliance-event.entity';
import { ComplianceEventResource, ComplianceEventsResponse } from './compliance-event-response';
import { ComplianceEventAssembler } from './compliance-event-assembler';

const complianceEndpointUrl = `${environment.serverBasePath}${environment.caComplianceEndpointPath}`;

/**
 * HTTP endpoint client for compliance event operations.
 *
 * @remarks
 * This endpoint encapsulates all HTTP communication for the ComplianceEvent entity
 * in the Compliance domain. It extends {@link BaseApiEndpoint} to inherit
 * standard CRUD operation implementations with event-specific configuration.
 *
 * The endpoint handles:
 * - GET /compliance-events?relatedEntityId={id} - Retrieve events filtered by a specific entity
 *
 * Resource conversion is delegated to {@link ComplianceEventAssembler}.
 *
 * @example
 * ```typescript
 * const endpoint = new ComplianceEventApiEndpoint(http);
 * endpoint.getEventsByEntity(123).subscribe(events => {
 *   // events are fully hydrated ComplianceEvent domain entities
 * });
 * ```
 */
export class ComplianceEventApiEndpoint extends BaseApiEndpoint<
  ComplianceEvent,
  ComplianceEventResource,
  ComplianceEventsResponse,
  ComplianceEventAssembler
> {
  /**
   * Creates an instance of ComplianceEventApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the endpoint with the configured server base path and the
   * compliance events endpoint path. The ComplianceEventAssembler is used to
   * convert between ComplianceEvent domain entities and ComplianceEventResource
   * infrastructure objects.
   */
  constructor(http: HttpClient) {
    super(http, complianceEndpointUrl, new ComplianceEventAssembler());
  }

  /**
   * Retrieves all compliance events associated with a specific entity ID.
   *
   * @param entityId - The unique numeric identifier of the related entity to filter by
   * @returns Observable stream emitting an array of ComplianceEvent domain entities
   *
   * @remarks
   * Performs a GET request with a query parameter to fetch audit trails
   * or compliance logs linked to a particular domain object.
   */
  getEventsByEntity(entityId: number): Observable<ComplianceEvent[]> {
    const params = new HttpParams().set('relatedEntityId', String(entityId));

    return this.http.get<ComplianceEventResource[]>(this.endpointUrl, { params }).pipe(
      map((resources) => this.assembler.toEntitiesFromResources(resources)),
      catchError(this.handleError(`Failed to fetch compliance events for entity ${entityId}`)),
    );
  }
}
