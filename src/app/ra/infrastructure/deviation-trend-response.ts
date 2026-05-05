import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface DataPointResource {
  timestamp: string;
  recordedValue: number;
  upperThreshold: number;
  lowerThreshold: number;
}

export interface DeviationTrendResource extends BaseResource {
  parameterName: string;
  equipmentId: string;
  trendDirection: string;
  dataPoints: DataPointResource[];
}

export interface DeviationTrendsResponse extends BaseResponse {
  trends: DeviationTrendResource[];
}
