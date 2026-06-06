import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a user entity in the identity and access management domain.
 * @remarks Implements BaseEntity using a numeric identifier.
 * @author QualiTrack
 */
export class User implements BaseEntity {
  private _id: number;
  private _username: string;
  private _roles: string[];

  /**
   * Creates a new User instance.
   * @param user - The user data object containing id, username, and roles.
   */
  constructor(user: { id: number; username: string; roles: string[] }) {
    this._id = user.id;
    this._username = user.username;
    this._roles = user.roles;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get roles(): string[] {
    return this._roles;
  }

  set roles(value: string[]) {
    this._roles = value;
  }
}
