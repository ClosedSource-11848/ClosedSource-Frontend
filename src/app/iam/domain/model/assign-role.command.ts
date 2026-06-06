/**
 * Command to assign a new role to an existing user.
 * @author QualiTrack
 */
export class AssignRoleCommand {
  private _userId: number;
  private _role: string;

  /**
   * Creates a new AssignRoleCommand instance.
   * @param resource - The data containing userId and the role to assign.
   */
  constructor(resource: { userId: number; role: string }) {
    this._userId = resource.userId;
    this._role = resource.role;
  }

  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

  get role(): string {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
  }
}
