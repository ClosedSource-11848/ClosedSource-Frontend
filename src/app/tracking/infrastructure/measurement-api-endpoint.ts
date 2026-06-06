import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Measurement } from '../domain/model/measurement.entity';
import { MeasurementResource, MeasurementsResponse } from './measurement-response';
import { MeasurementAssembler } from './measurement-assembler';

const endpointUrl = `${environment.serverBasePath}${environment.trackingTelemetryEndpointPath}/measurements`;

/**
 * HTTP endpoint client for raw telemetry measurement operations.
 *
 * @remarks
 * This endpoint encapsulates all HTTP communication for the Measurement entity
 * within the Tracking and Telemetry domain. It extends {@link BaseApiEndpoint}
 * to leverage standard data access patterns for handling incoming data points
 * and sensor readings from laboratory equipment.
 */
export class MeasurementApiEndpoint extends BaseApiEndpoint<
  Measurement,
  MeasurementResource,
  MeasurementsResponse,
  MeasurementAssembler
> {
  /**
   * Creates an instance of MeasurementApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the endpoint with the configured server base path and the
   * measurements endpoint path. The MeasurementAssembler is used to map
   * between infrastructure resources (DTOs) and internal domain entities.
   */
  constructor(http: HttpClient) {
    super(http, endpointUrl, new MeasurementAssembler());
  }
}
