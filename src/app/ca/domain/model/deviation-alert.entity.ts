import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class DeviationAlert implements BaseEntity {
  id: string;
  equipmentId: string;
  batchId?: string;
  parameterName: string;
  recordedValue: number;
  thresholdValue: number;
  unit: string;
  timestamp: string;
  severity: string;
  status: string;
  createdAt: string;

  constructor(params: {
    id: string;
    equipmentId: string;
    batchId?: string;
    parameterName: string;
    recordedValue: number;
    thresholdValue: number;
    unit: string;
    timestamp: string;
    severity: string;
    status: string;
    createdAt: string;
  }) {
    this.id = params.id;
    this.equipmentId = params.equipmentId;
    this.batchId = params.batchId;
    this.parameterName = params.parameterName;
    this.recordedValue = params.recordedValue;
    this.thresholdValue = params.thresholdValue;
    this.unit = params.unit;
    this.timestamp = params.timestamp;
    this.severity = params.severity;
    this.status = params.status;
    this.createdAt = params.createdAt;
  }
}
