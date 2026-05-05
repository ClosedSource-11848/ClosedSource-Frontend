import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { KpiMetric } from './kpi-metric.entity';

export class KpiDashboard implements BaseEntity {
  id: string;
  labId: string;
  timestamp: string;
  overallHealthScore: number;
  metrics: KpiMetric[];

  constructor(params: {
    id: string;
    labId: string;
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
