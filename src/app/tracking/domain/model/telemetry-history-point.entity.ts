import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class TelemetryHistoryPoint implements BaseEntity {
  id: string;
  equipmentId: string;
  parameterName: string;
  recordedValue: number;
  timestamp: string;
  isAnomaly: boolean;
  createdAt: string;

  constructor(params: {
    id: string;
    equipmentId: string;
    parameterName: string;
    recordedValue: number;
    timestamp: string;
    isAnomaly: boolean;
    createdAt: string;
  }) {
    this.id = params.id;
    this.equipmentId = params.equipmentId;
    this.parameterName = params.parameterName;
    this.recordedValue = params.recordedValue;
    this.timestamp = params.timestamp;
    this.isAnomaly = params.isAnomaly;
    this.createdAt = params.createdAt;
  }
}
