import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class ComplianceEvent implements BaseEntity {
  id: string;
  relatedEntityId: string;
  eventType: string;
  description: string;
  timestamp: string;
  resolvedBy?: string;
  createdAt: string;

  constructor(params: {
    id: string;
    relatedEntityId: string;
    eventType: string;
    description: string;
    timestamp: string;
    resolvedBy?: string;
    createdAt: string;
  }) {
    this.id = params.id;
    this.relatedEntityId = params.relatedEntityId;
    this.eventType = params.eventType;
    this.description = params.description;
    this.timestamp = params.timestamp;
    this.resolvedBy = params.resolvedBy;
    this.createdAt = params.createdAt;
  }
}
