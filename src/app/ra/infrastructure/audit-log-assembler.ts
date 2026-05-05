import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AuditLogEntry } from '../domain/model/audit-log-entry.entity';
import { AuditLogEntryResource, AuditLogEntriesResponse } from './audit-log-response';

export class AuditLogAssembler implements BaseAssembler<
  AuditLogEntry,
  AuditLogEntryResource,
  AuditLogEntriesResponse
> {
  toEntitiesFromResponse(response: AuditLogEntriesResponse): AuditLogEntry[] {
    return response.auditLogs.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: AuditLogEntryResource): AuditLogEntry {
    return new AuditLogEntry({
      id: resource.id,
      action: resource.action,
      entityType: resource.entityType,
      entityId: resource.entityId,
      performedBy: resource.performedBy,
      timestamp: resource.timestamp,
      details: resource.details,
    });
  }

  toResourceFromEntity(entity: AuditLogEntry): AuditLogEntryResource {
    return {
      id: entity.id,
      action: entity.action,
      entityType: entity.entityType,
      entityId: entity.entityId,
      performedBy: entity.performedBy,
      timestamp: entity.timestamp,
      details: entity.details,
    } as AuditLogEntryResource;
  }
}
