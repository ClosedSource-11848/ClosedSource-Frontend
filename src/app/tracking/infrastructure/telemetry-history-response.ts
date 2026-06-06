import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a historical telemetry data point for API communication.
 *
 * @remarks
 * In DDD, this acts as the infrastructure-level contract that represents
 * time-series telemetry data as it appears in HTTP responses. It bridges
 * the gap between external API consumers and the internal TelemetryHistoryPoint entity.
 */
export interface TelemetryHistoryPointResource extends BaseResource {
  /**
   * The unique numeric identifier for the telemetry history point resource.
   */
  id: number;

  /**
   * The numeric identifier of the equipment that generated this telemetry.
   */
  equipmentId: number;

  /**
   * The name of the process parameter that was measured (e.g., 'Temperature', 'Humidity').
   */
  parameterName: string;

  /**
   * The actual value recorded for the parameter at the given timestamp.
   */
  recordedValue: number;

  /**
   * The exact timestamp when the telemetry reading was captured by the equipment sensor.
   */
  timestamp: string;

  /**
   * Flag indicating whether this specific data point was identified as an anomaly
   * or deviation from acceptable operational thresholds.
   */
  isAnomaly: boolean;

  /**
   * The timestamp when this historical record was persisted into the system.
   */
  createdAt: string;
}

/**
 * Response envelope for telemetry history collection queries.
 *
 * @remarks
 * This interface defines the structure of API responses that return multiple historical data points.
 * It allows for consistent metadata handling across collection endpoints.
 */
export interface TelemetryHistoryResponse extends BaseResponse {
  /**
   * Array of telemetry history point resources included in the response.
   */
  historyPoints: TelemetryHistoryPointResource[];
}
