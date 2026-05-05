import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { DeviationAlert } from '../domain/model/deviation-alert.entity';
import { AlertResource, AlertsResponse } from './alert-response';
import { AlertAssembler } from './alert-assembler';

const alertsEndpointUrl = `${environment.serverBasePath}${environment.caAlertsEndpointPath}`;

export class AlertApiEndpoint extends BaseApiEndpoint<
  DeviationAlert,
  AlertResource,
  AlertsResponse,
  AlertAssembler
> {
  constructor(http: HttpClient) {
    super(http, alertsEndpointUrl, new AlertAssembler());
  }

  getAlerts(filters?: {
    equipmentId?: string;
    batchId?: string;
    status?: string;
    severity?: string;
  }): Observable<DeviationAlert[]> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params = params.append(key, value);
      });
    }

    return this.http.get<AlertsResponse>(this.endpointUrl, { params }).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response)),
      catchError(this.handleError('Failed to fetch deviation alerts')),
    );
  }
}
