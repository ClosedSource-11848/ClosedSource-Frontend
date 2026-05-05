import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface AlertResource extends BaseResource {
  id: string;
  equipmentId: string;
  batchId?: string;
  parameterName: string;
  recordedValue: number;
  thresholdValue: number;
  unit: string;
  timestamp: string;
  severity: string;
  status: string;
  createdAt: string;
}

export interface AlertsResponse extends BaseResponse {
  alerts: AlertResource[];
}
