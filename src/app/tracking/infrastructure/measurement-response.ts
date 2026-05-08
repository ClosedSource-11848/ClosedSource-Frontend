import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface MeasurementResource extends BaseResource {
  equipmentId: string;
  parameterName: string;
  value: number;
  unit: string;
  timestamp: string;
  createdAt: string;
}

export interface MeasurementsResponse extends BaseResponse {
  measurements: MeasurementResource[];
}
