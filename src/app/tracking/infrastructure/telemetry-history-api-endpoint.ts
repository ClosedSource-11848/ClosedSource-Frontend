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

const telemetryHistoryEndpointUrl = `${environment.serverBasePath}${environment.trackingTelemetryEndpointPath}/history`;

/**
 * HTTP endpoint client for historical telemetry operations.
 *
 * @remarks
 * This endpoint retrieves historical telemetry points used by charts, anomaly
 * views, and tracking history screens.
 */
export class TelemetryHistoryApiEndpoint extends BaseApiEndpoint<
  TelemetryHistoryPoint,
  TelemetryHistoryPointResource,
  TelemetryHistoryResponse,
  TelemetryHistoryAssembler
> {
  /**
   * Creates a new TelemetryHistoryApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, telemetryHistoryEndpointUrl, new TelemetryHistoryAssembler());
  }

  /**
   * Retrieves telemetry history using optional filters.
   *
   * @param filters - Optional query filters
   * @param filters.equipmentId - Numeric equipment identifier
   * @param filters.from - Start timestamp in ISO string format
   * @param filters.to - End timestamp in ISO string format
   * @returns Observable stream emitting historical telemetry points
   *
   * @remarks
   * The backend may return either a direct array or a response envelope containing
   * a `historyPoints` property. This method supports both response styles.
   */
  getTelemetryHistory(filters?: {
    equipmentId?: number;
    from?: string;
    to?: string;
  }): Observable<TelemetryHistoryPoint[]> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, String(value));
        }
      });
    }

    return this.http
      .get<TelemetryHistoryResponse | TelemetryHistoryPointResource[]>(this.endpointUrl, { params })
      .pipe(
        map((response) => {
          if (Array.isArray(response)) {
            return response.map((resource) => this.assembler.toEntityFromResource(resource));
          }

          return this.assembler.toEntitiesFromResponse(response);
        }),
        catchError(this.handleError('Failed to fetch telemetry history')),
      );
  }
}
