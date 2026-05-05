import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface AuditLogEntryResource extends BaseResource {
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

export interface AuditLogEntriesResponse extends BaseResponse {
  auditLogs: AuditLogEntryResource[];
}
