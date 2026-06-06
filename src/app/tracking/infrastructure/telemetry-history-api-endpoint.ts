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

const endpointUrl = `${environment.serverBasePath}${environment.trackingTelemetryEndpointPath}/history`;

/**
 * HTTP endpoint client for historical telemetry data operations.
 *
 * @remarks
 * This endpoint encapsulates all HTTP communication for the TelemetryHistoryPoint entity
 * within the Tracking and Telemetry domain. It extends {@link BaseApiEndpoint}
 * to leverage standard data access patterns with specialized filtering configuration.
 *
 * The endpoint handles retrieving time-series operational data from equipment sensors,
 * which is utilized for generating trends, identifying anomalies, and historical analysis.
 */
export class TelemetryHistoryApiEndpoint extends BaseApiEndpoint<
  TelemetryHistoryPoint,
  TelemetryHistoryPointResource,
  TelemetryHistoryResponse,
  TelemetryHistoryAssembler
> {
  /**
   * Creates an instance of TelemetryHistoryApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the endpoint with the configured server base path and the
   * telemetry history endpoint path. The TelemetryHistoryAssembler is used to map
   * between infrastructure resources and domain entities.
   */
  constructor(http: HttpClient) {
    super(http, endpointUrl, new TelemetryHistoryAssembler());
  }

  /**
   * Retrieves a collection of historical telemetry data points based on provided criteria.
   *
   * @param filters - Optional object containing query parameters to filter the history logs
   * @param filters.equipmentId - Filter by the numeric identifier of specific equipment
   * @param filters.from - Start date and time for the telemetry query (ISO string format)
   * @param filters.to - End date and time for the telemetry query (ISO string format)
   * @returns Observable stream emitting an array of TelemetryHistoryPoint domain entities
   *
   * @remarks
   * Constructs dynamic HTTP parameters from the provided filters and performs a GET request
   * to fetch the time-series records.
   */
  getTelemetryHistory(filters?: {
    equipmentId?: number;
    from?: string;
    to?: string;
  }): Observable<TelemetryHistoryPoint[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.equipmentId) params = params.set('equipmentId', filters.equipmentId.toString());
      if (filters.from) params = params.set('from', filters.from);
      if (filters.to) params = params.set('to', filters.to);
    }

    return this.http.get<TelemetryHistoryResponse>(this.endpointUrl, { params }).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response)),
      catchError(this.handleError('Failed to fetch telemetry history')),
    );
  }
}
