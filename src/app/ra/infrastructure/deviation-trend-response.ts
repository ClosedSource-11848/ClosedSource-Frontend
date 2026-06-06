import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a single measurement data point.
 *
 * @remarks
 * Used within a trend resource to transfer historical parameter data
 * and its associated reference thresholds over the API.
 */
export interface DataPointResource {
  /**
   * The timestamp of when the measurement was recorded.
   */
  timestamp: string;

  /**
   * The actual value recorded at the given timestamp.
   */
  recordedValue: number;

  /**
   * The upper acceptable limit for the parameter at this timestamp.
   */
  upperThreshold: number;

  /**
   * The lower acceptable limit for the parameter at this timestamp.
   */
  lowerThreshold: number;
}

/**
 * Resource representation of a deviation trend for API communication.
 *
 * @remarks
 * In DDD, this acts as the infrastructure-level contract that represents
 * the trend analysis data as it appears in HTTP responses. It bridges
 * the gap between external API consumers and the internal DeviationTrend entity.
 */
export interface DeviationTrendResource extends BaseResource {
  /**
   * The unique numeric identifier for the deviation trend resource.
   */
  id: number;

  /**
   * The name of the process parameter being analyzed (e.g., 'Temperature').
   */
  parameterName: string;

  /**
   * The numeric identifier of the equipment associated with this trend.
   */
  equipmentId: number;

  /**
   * The string representation of the identified trend direction (e.g., 'STABLE', 'INCREASING').
   */
  trendDirection: string;

  /**
   * The collection of temporal measurements that make up the trend analysis.
   */
  dataPoints: DataPointResource[];
}

/**
 * Response envelope for deviation trend collection queries.
 *
 * @remarks
 * This interface defines the structure of API responses that return multiple trend analyses.
 * It allows for consistent metadata handling across collection endpoints.
 */
export interface DeviationTrendsResponse extends BaseResponse {
  /**
   * Array of deviation trend resources included in the response.
   */
  trends: DeviationTrendResource[];
}
