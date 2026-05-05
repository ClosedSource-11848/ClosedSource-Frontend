import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { ComplianceEvent } from '../domain/model/compliance-event.entity';
import { ComplianceEventResource, ComplianceEventsResponse } from './compliance-event-response';
import { ComplianceEventAssembler } from './compliance-event-assembler';

const complianceEndpointUrl = `${environment.serverBasePath}${environment.caComplianceEndpointPath}`;

export class ComplianceEventApiEndpoint extends BaseApiEndpoint<
  ComplianceEvent,
  ComplianceEventResource,
  ComplianceEventsResponse,
  ComplianceEventAssembler
> {
  constructor(http: HttpClient) {
    super(http, complianceEndpointUrl, new ComplianceEventAssembler());
  }

  getEventsByEntity(entityId: string): Observable<ComplianceEvent[]> {
    return this.http.get<ComplianceEventsResponse>(`${this.endpointUrl}/entity/${entityId}`).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response)),
      catchError(this.handleError(`Failed to fetch compliance events for entity ${entityId}`)),
    );
  }
}
