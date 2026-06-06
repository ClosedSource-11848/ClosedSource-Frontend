import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents an individual Key Performance Indicator (KPI) metric.
 *
 * @remarks
 * In Domain-Driven Design, KpiMetric is an entity that captures a specific
 * measurement of laboratory or process performance. It compares a recorded
 * value against a defined target to determine operational status.
 *
 * This entity is crucial for tracking specific goals, such as equipment
 * uptime, calibration precision, or sample turnaround times.
 */
export class KpiMetric implements BaseEntity {
  /**
   * The unique numeric identifier for this KPI metric record.
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
   * The evaluated health status of the metric based on its performance against the target.
   */
  status: 'ON_TRACK' | 'AT_RISK' | 'CRITICAL' | 'UNKNOWN';

  /**
   * The timestamp when this metric was recorded.
   */
  recordedAt: string;

  /**
   * Creates a new KpiMetric entity.
   *
   * @param params - Initialization properties
   * @param params.id - Unique numeric ID of the metric
   * @param params.name - Descriptive name of the indicator
   * @param params.value - Current measurement
   * @param params.unit - Measurement unit
   * @param params.targetValue - Goal value
   * @param params.status - Operational health status
   * @param params.recordedAt - Recording time
   */
  constructor(params: {
    id: number;
    name: string;
    value: number;
    unit: string;
    targetValue: number;
    status: 'ON_TRACK' | 'AT_RISK' | 'CRITICAL' | 'UNKNOWN';
    recordedAt: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.value = params.value;
    this.unit = params.unit;
    this.targetValue = params.targetValue;
    this.status = params.status;
    this.recordedAt = params.recordedAt;
  }
}
