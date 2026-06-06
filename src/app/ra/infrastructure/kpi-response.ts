import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a single Key Performance Indicator (KPI) metric.
 *
 * @remarks
 * Used within a dashboard resource to transfer individual performance
 * measurements and their evaluated status over the API.
 */
export interface KpiMetricResource {
  /**
   * The unique numeric identifier for the KPI metric resource.
   */
  id: number;

  /**
   * The name of the performance indicator (e.g., 'Equipment Availability').
   */
  name: string;

  /**
   * The current measured value of the metric.
   */
  value: number;

  /**
   * The unit of measurement for this metric.
   */
  unit: string;

  /**
   * The goal or threshold value against which the current value is evaluated.
   */
  targetValue: number;

  /**
   * The evaluated health status of the metric (e.g., 'ON_TRACK', 'AT_RISK', 'CRITICAL').
   */
  status: string;

  /**
   * The timestamp when this metric was recorded.
   */
  recordedAt: string;
}

/**
 * Resource representation of a KPI dashboard snapshot for API communication.
 *
 * @remarks
 * In DDD, this acts as the infrastructure-level contract that represents
 * the performance dashboard data as it appears in HTTP responses. It bridges
 * the gap between external API consumers and the internal KpiDashboard entity.
 */
export interface KpiDashboardResource extends BaseResource {
  /**
   * The unique numeric identifier for the dashboard resource.
   */
  id: number;

  /**
   * The numeric identifier of the laboratory associated with these KPIs.
   */
  labId: number;

  /**
   * The timestamp when these metrics were aggregated.
   */
  timestamp: string;

  /**
   * A calculated score representing the overall performance or health status of the lab.
   */
  overallHealthScore: number;

  /**
   * The collection of individual performance metrics included in this snapshot.
   */
  metrics: KpiMetricResource[];
}

/**
 * Response envelope for KPI dashboard collection queries.
 *
 * @remarks
 * This interface defines the structure of API responses that return multiple dashboard snapshots.
 * It allows for consistent metadata handling across collection endpoints.
 */
export interface KpiDashboardsResponse extends BaseResponse {
  /**
   * Array of KPI dashboard resources included in the response.
   */
  dashboards: KpiDashboardResource[];
}
