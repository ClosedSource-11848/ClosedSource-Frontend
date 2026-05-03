/**
 * Command to recover a user's password using their username/email.
 * @author QualiTrack
 */
export class RecoverPasswordCommand {
  private _username: string;

  /**
   * Creates a new RecoverPasswordCommand instance.
   * @param resource - The data containing the username to recover.
   */
  constructor(resource: { username: string }) {
    this._username = resource.username;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }
}
