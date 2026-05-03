/**
 * Command to assign a new role to an existing user.
 * @author QualiTrack
 */
export class AssignRoleCommand {
  private _userId: string;
  private _role: string;

  /**
   * Creates a new AssignRoleCommand instance.
   * @param resource - The data containing userId and the role to assign.
   */
  constructor(resource: { userId: string; role: string }) {
    this._userId = resource.userId;
    this._role = resource.role;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get role(): string {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
  }
}
