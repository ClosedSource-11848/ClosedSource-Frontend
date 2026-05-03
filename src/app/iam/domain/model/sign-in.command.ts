/**
 * Command to sign in a user with a username and password.
 * @author QualiTrack
 */
export class SignInCommand {
  private _username: string;
  private _password: string;

  /**
   * Creates a new SignInCommand instance.
   * @param resource - The sign-in data containing username and password.
   */
  constructor(resource: { username: string; password: string }) {
    this._username = resource.username;
    this._password = resource.password;
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
}
