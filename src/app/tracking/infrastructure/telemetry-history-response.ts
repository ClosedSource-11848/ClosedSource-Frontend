import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface TelemetryHistoryPointResource extends BaseResource {
  equipmentId: string;
  parameterName: string;
  recordedValue: number;
  timestamp: string;
  isAnomaly: boolean;
  createdAt: string;
}

export interface TelemetryHistoryResponse extends BaseResponse {
  historyPoints: TelemetryHistoryPointResource[];
}
