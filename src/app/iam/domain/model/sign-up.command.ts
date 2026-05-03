/**
 * Command to sign up a new user with a username, password, and roles.
 * @author QualiTrack
 */
export class SignUpCommand {
  private _username: string;
  private _password: string;
  private _roles: string[];

  /**
   * Creates a new SignUpCommand instance.
   * @param resource - The sign-up data containing username, password, and roles.
   */
  constructor(resource: { username: string; password: string; roles?: string[] }) {
    this._username = resource.username;
    this._password = resource.password;
    this._roles = resource.roles || ['ROLE_LAB_OPERATOR'];
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get roles(): string[] {
    return this._roles;
  }

  set roles(value: string[]) {
    this._roles = value;
  }
}
