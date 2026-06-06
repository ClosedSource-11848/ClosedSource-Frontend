import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a staff member entity within the Laboratory domain.
 *
 * @remarks
 * In Domain-Driven Design, a StaffMember is an entity that models a human actor
 * belonging to a laboratory organization. Each staff member has a unique numeric identity
 * and is always scoped to the laboratory they are assigned to.
 *
 * This entity captures the essential professional profile of a staff member,
 * including their role within the laboratory and their current operational status.
 * It is intended to support access control, audit trails, and assignment of
 * responsibilities within laboratory workflows.
 *
 * @example
 * ```typescript
 * const staff = new StaffMember({
 * id: 1,
 * labId: 123,
 * fullName: 'María Elena Torres',
 * role: 'Quality Control Analyst',
 * email: 'metorres@biolabperu.com',
 * active: true,
 * createdAt: '2024-05-20T08:00:00Z',
 * });
 *
 * console.log(staff.fullName); // 'María Elena Torres'
 * console.log(staff.active);   // true
 * ```
 */
export class StaffMember implements BaseEntity {
  /**
   * The unique numeric identifier for this staff member record.
   */
  id: number;

  /**
   * The numeric identifier of the laboratory this staff member belongs to.
   *
   * @remarks
   * This field establishes the relationship between the staff member and its
   * parent {@link Laboratory} entity, scoping the member's responsibilities
   * and access to a specific laboratory context.
   */
  labId: number;

  /**
   * The full legal name of the staff member.
   *
   * @remarks
   * This value is used in official documentation, audit logs, and regulatory
   * reports where a person's identity must be unambiguously referenced.
   * It should reflect the name as it appears on official identification.
   */
  fullName: string;

  /**
   * The professional role or position held by the staff member within the laboratory.
   *
   * @remarks
   * The role determines the staff member's area of responsibility and may be used
   * to control access to specific laboratory workflows, such as batch approval,
   * quality analysis, or regulatory submissions. Examples include
   * `'Quality Control Analyst'`, `'Production Supervisor'`, or `'Regulatory Affairs Manager'`.
   */
  role: string;

  /**
   * The institutional or corporate email address of the staff member.
   *
   * @remarks
   * Used as the primary communication channel and may serve as a login identifier
   * within the system. Should be unique per staff member across the platform.
   */
  email: string;

  /**
   * Indicates whether this staff member is currently active in the system.
   *
   * @remarks
   * An inactive staff member (`false`) represents a person who has left the
   * laboratory or has been suspended, but whose record is retained for historical
   * traceability — for example, to preserve their authorship on past records,
   * batch approvals, or audit entries. Inactive members should not be assignable
   * to new tasks or workflows.
   */
  active: boolean;

  /**
   * The ISO 8601 timestamp indicating when this staff member record was created.
   */
  createdAt: string;

  /**
   * Creates a new StaffMember entity.
   *
   * @param params - Initialization properties
   * @param params.id - The unique numeric identifier for the staff member
   * @param params.labId - The numeric identifier of the laboratory they belong to
   * @param params.fullName - The full legal name of the staff member
   * @param params.role - The professional role or position within the laboratory
   * @param params.email - The institutional email address of the staff member
   * @param params.active - Whether the staff member is currently active in the system
   * @param params.createdAt - The creation timestamp in ISO 8601 format
   *
   * @remarks
   * The constructor initializes all fields directly from the provided params object.
   * All fields are required and no defaults are applied.
   */
  constructor(params: {
    id: number;
    labId: number;
    fullName: string;
    role: string;
    email: string;
    active: boolean;
    createdAt: string;
  }) {
    this.id = params.id;
    this.labId = params.labId;
    this.fullName = params.fullName;
    this.role = params.role;
    this.email = params.email;
    this.active = params.active;
    this.createdAt = params.createdAt;
  }
}
