import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents an entry in the system's audit log.
 *
 * @remarks
 * In Domain-Driven Design, AuditLogEntry is an entity that captures a historical
 * record of a specific action performed within the system. It ensures non-repudiation
 * and provides traceability by linking actions to the actors who performed them
 * and the entities they affected.
 *
 * This entity is essential for security compliance and debugging system behavior.
 */
export class AuditLogEntry implements BaseEntity {
  /**
   * The unique numeric identifier for this audit log entry.
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

  /**
   * Creates a new AuditLogEntry entity.
   *
   * @param params - Initialization properties
   * @param params.id - Unique numeric ID of the entry
   * @param params.action - The operation performed
   * @param params.entityType - The domain object category
   * @param params.entityId - Numeric ID of the targeted object
   * @param params.performedBy - Numeric ID of the actor
   * @param params.timestamp - Occurrence time
   * @param params.details - Descriptive details of the action
   */
  constructor(params: {
    id: number;
    action: string;
    entityType: string;
    entityId: number;
    performedBy: number;
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
