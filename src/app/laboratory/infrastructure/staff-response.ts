import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Represents the raw API response shape for a single staff member resource
 * as returned by the remote server.
 *
 * @remarks
 * `StaffMemberResource` extends {@link BaseResource} to inherit any common
 * envelope fields defined at the infrastructure level. It models the deserialized
 * JSON object received from the server and serves as the input type for
 * `StaffMemberAssembler`, which maps it into a {@link StaffMember} domain entity.
 *
 * This interface belongs to the infrastructure layer and must not be consumed
 * directly by the application or domain layers. Any consumer needing staff
 * member data should operate on the {@link StaffMember} entity instead.
 *
 * @example
 * ```typescript
 * const resource: StaffMemberResource = {
 *   id: 'staff-001',
 *   labId: 'lab-123',
 *   fullName: 'María Elena Torres',
 *   role: 'Quality Control Analyst',
 *   email: 'metorres@biolabperu.com',
 *   active: true,
 *   createdAt: '2024-05-20T08:00:00Z',
 * };
 * ```
 */
export interface StaffMemberResource extends BaseResource {
  /** The unique identifier of the staff member as assigned by the server. */
  id: string;

  /** The identifier of the laboratory this staff member belongs to. */
  labId: string;

  /**
   * The full legal name of the staff member as stored on the server.
   *
   * @remarks
   * Used in audit logs, regulatory reports, and official laboratory documentation
   * where unambiguous personal identification is required.
   */
  fullName: string;

  /** The professional role or position held by the staff member within the laboratory. */
  role: string;

  /**
   * The institutional or corporate email address of the staff member.
   *
   * @remarks
   * Unique across all staff members within the platform. May also serve as
   * the staff member's login identifier within the system.
   */
  email: string;

  /**
   * Indicates whether this staff member is currently active.
   *
   * @remarks
   * An inactive staff member (`false`) is retained on the server for historical
   * traceability, including authorship on past audit entries and batch approvals.
   * Inactive members should not be assignable to new tasks or workflows.
   */
  active: boolean;

  /** The ISO 8601 timestamp indicating when the staff member record was created on the server. */
  createdAt: string;
}

/**
 * Represents the raw API response shape for a collection of staff member
 * resources as returned by the remote server.
 *
 * @remarks
 * `StaffMembersResponse` extends {@link BaseResponse} to inherit any common
 * collection envelope fields defined at the infrastructure level (e.g.,
 * pagination metadata or status wrappers). It wraps an array of
 * {@link StaffMemberResource} objects and serves as the deserialized response
 * type for list-based endpoints that return multiple staff members.
 *
 * As with {@link StaffMemberResource}, this interface belongs to the
 * infrastructure layer and must not be consumed directly by the application
 * or domain layers.
 *
 * @example
 * ```typescript
 * const response: StaffMembersResponse = {
 *   staffMembers: [
 *     {
 *       id: 'staff-001',
 *       labId: 'lab-123',
 *       fullName: 'María Elena Torres',
 *       role: 'Quality Control Analyst',
 *       email: 'metorres@biolabperu.com',
 *       active: true,
 *       createdAt: '2024-05-20T08:00:00Z',
 *     }
 *   ]
 * };
 * ```
 */
export interface StaffMembersResponse extends BaseResponse {
  /**
   * The array of staff member resources returned by the server.
   *
   * @remarks
   * Each element must be mapped to a {@link StaffMember} domain entity via
   * `StaffMemberAssembler` before being consumed by the application or
   * presentation layers.
   */
  staffMembers: StaffMemberResource[];
}
