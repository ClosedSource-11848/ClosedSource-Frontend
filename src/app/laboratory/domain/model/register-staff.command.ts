/**
 * Represents the command payload for registering a new staff member
 * within the Laboratory domain.
 *
 * @remarks
 * In Command Query Responsibility Segregation (CQRS), a command encapsulates
 * the intent to perform a state-changing operation. This command carries the
 * minimum required data to register a new {@link StaffMember} under a specific
 * laboratory.
 *
 * This interface is intended to be used as the input contract for the
 * corresponding use case or application service responsible for staff registration.
 * It does not include system-generated fields such as `id`, `active`, or
 * `createdAt`, as those are assigned by the domain or persistence layer.
 * Newly registered staff members are considered active by default.
 *
 * @example
 * ```typescript
 * const command: RegisterStaffCommand = {
 *   labId: 123',
 *   fullName: 'María Elena Torres',
 *   role: 'Quality Control Analyst',
 *   email: 'metorres@biolabperu.com',
 * };
 * ```
 */
export interface RegisterStaffCommand {
  /**
   * The identifier of the laboratory under which the staff member will be registered.
   *
   * @remarks
   * This field scopes the new staff member to a specific {@link Laboratory} entity,
   * ensuring that their role and responsibilities are contained within the correct
   * organizational context.
   */
  labId: number;

  /**
   * The full legal name of the staff member being registered.
   *
   * @remarks
   * Should reflect the name as it appears on official identification, as it will
   * be used in audit logs, regulatory reports, and official laboratory documentation
   * where unambiguous personal identification is required.
   */
  fullName: string;

  /**
   * The professional role or position the staff member will hold within the laboratory.
   *
   * @remarks
   * The role may be used by the system to determine access permissions and
   * workflow responsibilities upon registration. The use case layer should
   * validate that the provided role corresponds to a recognized position
   * within the laboratory's organizational structure. Examples include
   * `'Quality Control Analyst'`, `'Production Supervisor'`, or
   * `'Regulatory Affairs Manager'`.
   */
  role: string;

  /**
   * The institutional or corporate email address of the staff member.
   *
   * @remarks
   * Must be unique across all staff members within the platform. The use case
   * layer should enforce this uniqueness constraint prior to persisting the
   * record. This value may also serve as the staff member's login identifier
   * within the system.
   */
  email: string;
}
