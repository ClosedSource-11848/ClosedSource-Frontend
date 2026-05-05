import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface KpiMetricResource {
  id: string;
  name: string;
  value: number;
  unit: string;
  targetValue: number;
  status: string;
  recordedAt: string;
}

export interface KpiDashboardResource extends BaseResource {
  labId: string;
  timestamp: string;
  overallHealthScore: number;
  metrics: KpiMetricResource[];
}

export interface KpiDashboardsResponse extends BaseResponse {
  dashboards: KpiDashboardResource[];
}
