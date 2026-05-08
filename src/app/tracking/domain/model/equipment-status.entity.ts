import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type TelemetryStatus = 'OPERATIONAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export class EquipmentStatus implements BaseEntity {
  id: string;
  equipmentId: string;
  isOnline: boolean;
  currentStatus: TelemetryStatus;
  lastHeartbeat: string;
  createdAt: string;

  constructor(params: {
    id: string;
    equipmentId: string;
    isOnline: boolean;
    currentStatus: TelemetryStatus;
    lastHeartbeat: string;
    createdAt: string;
  }) {
    this.id = params.id;
    this.equipmentId = params.equipmentId;
    this.isOnline = params.isOnline;
    this.currentStatus = params.currentStatus;
    this.lastHeartbeat = params.lastHeartbeat;
    this.createdAt = params.createdAt;
  }
}
