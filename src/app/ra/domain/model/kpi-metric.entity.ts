import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class KpiMetric implements BaseEntity {
  id: string;
  name: string;
  value: number;
  unit: string;
  targetValue: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'CRITICAL' | 'UNKNOWN';
  recordedAt: string;

  constructor(params: {
    id: string;
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
