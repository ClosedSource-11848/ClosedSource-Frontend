import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of an audit log entry for API communication.
 *
 * @remarks
 * In DDD, this acts as the infrastructure-level contract that represents
 * the audit log data as it appears in HTTP responses. It bridges
 * the gap between external API consumers and the internal AuditLogEntry entity.
 */
export interface AuditLogEntryResource extends BaseResource {
  /**
   * The unique numeric identifier for the audit log resource.
   */
  id: number;

  /**
   * The action performed (e.g., 'CREATE', 'UPDATE', 'DELETE').
   */
  action: string;

  /**
   * The type of domain entity affected (e.g., 'Equipment', 'DeviationAlert').
   */
  entityType: string;

  /**
   * The numeric identifier of the entity being acted upon.
   */
  entityId: number;

  /**
   * The numeric identifier of the user or system agent who performed the action.
   */
  performedBy: number;

  /**
   * The exact timestamp when the action occurred.
   */
  timestamp: string;

  /**
   * Additional context or serialized changes related to the action.
   */
  details: string;
}

/**
 * Response envelope for audit log collection queries.
 *
 * @remarks
 * This interface defines the structure of API responses that return multiple audit logs.
 * It allows for consistent metadata handling across collection endpoints.
 */
export interface AuditLogEntriesResponse extends BaseResponse {
  /**
   * Array of audit log entry resources included in the response.
   */
  auditLogs: AuditLogEntryResource[];
}
