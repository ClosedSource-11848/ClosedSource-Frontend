import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a sequence of measurements for a specific parameter,
 * used for analyzing process behavior over time.
 */
export interface DataPoint {
  timestamp: string;
  recordedValue: number;
  upperThreshold: number;
  lowerThreshold: number;
}

/**
 * Represents the trend analysis of a process parameter for a specific piece of equipment.
 *
 * @remarks
 * In Domain-Driven Design, a DeviationTrend is an entity that encapsulates
 * the historical progression of a measurement parameter. It provides the necessary
 * data to identify patterns (increasing, decreasing, or stable) that could
 * signal future deviations.
 *
 * This entity is vital for predictive maintenance and quality control analysis.
 */
export class DeviationTrend implements BaseEntity {
  /**
   * The unique numeric identifier for this trend analysis record.
   */
  id: number;

  /**
   * The name of the process parameter being analyzed (e.g., Temperature, Pressure).
   */
  parameterName: string;

  /**
   * The numeric identifier of the equipment associated with this trend.
   */
  equipmentId: number;

  /**
   * The identified pattern of the parameter's movement.
   */
  trendDirection: 'STABLE' | 'INCREASING' | 'DECREASING';

  /**
   * The collection of temporal measurements used to determine the trend.
   */
  dataPoints: DataPoint[];

  /**
   * Creates a new DeviationTrend entity.
   *
   * @param params - Initialization properties
   * @param params.id - The unique numeric identifier for the trend
   * @param params.parameterName - Name of the monitored variable
   * @param params.equipmentId - Numeric ID of the equipment
   * @param params.trendDirection - The detected movement pattern
   * @param params.dataPoints - Historical measurements
   */
  constructor(params: {
    id: number;
    parameterName: string;
    equipmentId: number;
    trendDirection: 'STABLE' | 'INCREASING' | 'DECREASING';
    dataPoints: DataPoint[];
  }) {
    this.id = params.id;
    this.parameterName = params.parameterName;
    this.equipmentId = params.equipmentId;
    this.trendDirection = params.trendDirection;
    this.dataPoints = params.dataPoints;
  }
}
