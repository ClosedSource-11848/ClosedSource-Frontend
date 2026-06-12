import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Measurement } from '../domain/model/measurement.entity';
import { MeasurementResource, MeasurementsResponse } from './measurement-response';
import { MeasurementAssembler } from './measurement-assembler';

const measurementsEndpointUrl = `${environment.serverBasePath}${environment.trackingTelemetryEndpointPath}/measurements`;

/**
 * HTTP endpoint client for telemetry measurement operations.
 *
 * @remarks
 * This endpoint encapsulates HTTP communication for real-time telemetry
 * measurements within the Tracking bounded context. It supports retrieving
 * latest measurements globally or filtered by a specific equipment ID.
 */
export class MeasurementApiEndpoint extends BaseApiEndpoint<
  Measurement,
  MeasurementResource,
  MeasurementsResponse,
  MeasurementAssembler
> {
  /**
   * Creates a new MeasurementApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, measurementsEndpointUrl, new MeasurementAssembler());
  }

  /**
   * Retrieves the latest telemetry measurements.
   *
   * @param equipmentId - Optional numeric identifier used to filter measurements by equipment
   * @returns Observable stream emitting an array of Measurement domain entities
   *
   * @remarks
   * The backend may return either a direct array or a response envelope containing
   * a `measurements` property. This method supports both response styles.
   */
  getLatestMeasurements(equipmentId?: number): Observable<Measurement[]> {
    let params = new HttpParams();

    if (equipmentId !== undefined && equipmentId !== null) {
      params = params.set('equipmentId', String(equipmentId));
    }

    return this.http
      .get<MeasurementsResponse | MeasurementResource[]>(this.endpointUrl, { params })
      .pipe(
        map((response) => {
          if (Array.isArray(response)) {
            return response.map((resource) => this.assembler.toEntityFromResource(resource));
          }

          return this.assembler.toEntitiesFromResponse(response);
        }),
        catchError(this.handleError('Failed to fetch latest telemetry measurements')),
      );
  }
}
