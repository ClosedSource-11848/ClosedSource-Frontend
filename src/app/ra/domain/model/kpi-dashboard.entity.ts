import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { KpiMetric } from './kpi-metric.entity';

/**
 * Represents a snapshot of the Key Performance Indicators (KPIs) for a laboratory.
 *
 * @remarks
 * In Domain-Driven Design, KpiDashboard is an entity that aggregates various
 * performance metrics to provide a comprehensive view of operational health.
 * It serves as a point-in-time report for laboratory efficiency, equipment
 * availability, and quality compliance.
 *
 * This entity is primarily used for management dashboards and trend analysis
 * within the laboratory operational context.
 */
export class KpiDashboard implements BaseEntity {
  /**
   * The unique numeric identifier for this dashboard snapshot.
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
  metrics: KpiMetric[];

  /**
   * Creates a new KpiDashboard entity.
   *
   * @param params - Initialization properties
   * @param params.id - Unique numeric identifier for the dashboard
   * @param params.labId - Numeric ID of the laboratory
   * @param params.timestamp - Aggregation time
   * @param params.overallHealthScore - Computed health index
   * @param params.metrics - Detailed list of performance indicators
   */
  constructor(params: {
    id: number;
    labId: number;
    timestamp: string;
    overallHealthScore: number;
    metrics: KpiMetric[];
  }) {
    this.id = params.id;
    this.labId = params.labId;
    this.timestamp = params.timestamp;
    this.overallHealthScore = params.overallHealthScore;
    this.metrics = params.metrics;
  }
}
