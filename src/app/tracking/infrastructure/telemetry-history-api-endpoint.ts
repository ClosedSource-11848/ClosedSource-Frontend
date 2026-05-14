import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { TelemetryHistoryPoint } from '../domain/model/telemetry-history-point.entity';
import {
  TelemetryHistoryPointResource,
  TelemetryHistoryResponse,
} from './telemetry-history-response';
import { TelemetryHistoryAssembler } from './telemetry-history-assembler';

//const endpointUrl = `${environment.serverBasePath}${environment.trackingTelemetryEndpointPath}/history`;
const endpointUrl = `${environment.trackingTelemetryEndpointPath}/history`;

export class TelemetryHistoryApiEndpoint extends BaseApiEndpoint<
  TelemetryHistoryPoint,
  TelemetryHistoryPointResource,
  TelemetryHistoryResponse,
  TelemetryHistoryAssembler
> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new TelemetryHistoryAssembler());
  }

  getTelemetryHistory(filters?: {
    equipmentId?: string;
    from?: string;
    to?: string;
  }): Observable<TelemetryHistoryPoint[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.equipmentId) params = params.set('equipmentId', filters.equipmentId);
      if (filters.from) params = params.set('from', filters.from);
      if (filters.to) params = params.set('to', filters.to);
    }

    return this.http.get<TelemetryHistoryResponse>(this.endpointUrl, { params }).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response)),
      catchError(this.handleError('Failed to fetch telemetry history')),
    );
  }
}
