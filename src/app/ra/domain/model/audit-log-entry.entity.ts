import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class AuditLogEntry implements BaseEntity {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  timestamp: string;
  details: string;

  constructor(params: {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    performedBy: string;
    timestamp: string;
    details: string;
  }) {
    this.id = params.id;
    this.action = params.action;
    this.entityType = params.entityType;
    this.entityId = params.entityId;
    this.performedBy = params.performedBy;
    this.timestamp = params.timestamp;
    this.details = params.details;
  }
}
