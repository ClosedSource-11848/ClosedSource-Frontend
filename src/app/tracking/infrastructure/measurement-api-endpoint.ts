import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Measurement } from '../domain/model/measurement.entity';
import { MeasurementResource, MeasurementsResponse } from './measurement-response';
import { MeasurementAssembler } from './measurement-assembler';

const endpointUrl = `${environment.serverBasePath}${environment.trackingTelemetryEndpointPath}/measurements`;

export class MeasurementApiEndpoint extends BaseApiEndpoint<
  Measurement,
  MeasurementResource,
  MeasurementsResponse,
  MeasurementAssembler
> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new MeasurementAssembler());
  }
}
