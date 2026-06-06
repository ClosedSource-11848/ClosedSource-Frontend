import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a single telemetry measurement for API communication.
 *
 * @remarks
 * In DDD, this acts as the infrastructure-level contract that represents
 * raw measurement data as it appears in HTTP responses. It bridges
 * the gap between external API consumers and the internal Measurement entity.
 */
export interface MeasurementResource extends BaseResource {
  /**
   * The unique numeric identifier for the measurement resource.
   */
  id: number;

  /**
   * The numeric identifier of the equipment that recorded this measurement.
   */
  equipmentId: number;

  /**
   * The name of the parameter being measured (e.g., 'Temperature', 'Pressure').
   */
  parameterName: string;

  /**
   * The actual recorded value of the measurement.
   */
  value: number;

  /**
   * The unit of measurement (e.g., 'Celsius', 'PSI', 'RPM').
   */
  unit: string;

  /**
   * The exact timestamp when the measurement was recorded by the equipment.
   */
  timestamp: string;

  /**
   * The timestamp when this measurement record was ingested into the system.
   */
  createdAt: string;
}

/**
 * Response envelope for measurement collection queries.
 *
 * @remarks
 * This interface defines the structure of API responses that return multiple measurements.
 * It allows for consistent metadata handling across collection endpoints.
 */
export interface MeasurementsResponse extends BaseResponse {
  /**
   * Array of measurement resources included in the response.
   */
  measurements: MeasurementResource[];
}
