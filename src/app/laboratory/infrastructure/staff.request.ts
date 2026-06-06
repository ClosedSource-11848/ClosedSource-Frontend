/**
 * Represents the HTTP request body for registering a new staff member
 * within the Laboratory API.
 *
 * @remarks
 * This interface defines the inbound data contract expected by the staff
 * registration endpoint. It models the deserialized JSON body of an HTTP
 * request and is responsible for carrying user-provided input from the
 * presentation layer to the application layer, where it is typically
 * mapped into a {@link RegisterStaffCommand} before being processed by
 * the corresponding use case.
 *
 * It deliberately excludes system-generated fields such as `id`, `active`,
 * and `createdAt`, as those are assigned by the domain and persistence
 * layers. Newly registered staff members are considered active by default.
 *
 * @example
 * ```typescript
 * const body: RegisterStaffRequest = {
 * labId: 123,
 * fullName: 'María Elena Torres',
 * role: 'Quality Control Analyst',
 * email: 'metorres@biolabperu.com',
 * };
 * ```
 */
export interface RegisterStaffRequest {
  /**
   * The numeric identifier of the laboratory under which the staff member will be registered.
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
   * workflow responsibilities upon registration. Examples include
   * `'Quality Control Analyst'`, `'Production Supervisor'`, or
   * `'Regulatory Affairs Manager'`.
   */
  role: string;

  /**
   * The institutional or corporate email address of the staff member.
   *
   * @remarks
   * Must be unique across all staff members within the platform. This value
   * may also serve as the staff member's login identifier within the system.
   * The API should enforce uniqueness through validation before persisting
   * the record.
   */
  email: string;
}
