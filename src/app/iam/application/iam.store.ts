import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../domain/model/user.entity';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { RecoverPasswordCommand } from '../domain/model/recover-password.command';

import { IamApi } from '../infrastructure/iam-api';
import { SignInRequest } from '../infrastructure/sign-in.request';
import { SignUpRequest } from '../infrastructure/sign-up.request';
import { RecoverPasswordRequest } from '../infrastructure/recover-password.request';

/**
 * Signal-based application store for Identity and Access Management.
 *
 * @remarks
 * This store belongs to the application layer. It receives IAM commands from
 * the presentation layer, maps them into infrastructure request DTOs, delegates
 * API operations to {@link IamApi}, and exposes authentication/session state
 * through Angular signals.
 *
 * The store also restores persisted session data from localStorage so protected
 * API calls keep working after a browser refresh.
 */
@Injectable({ providedIn: 'root' })
export class IamStore {
  /**
   * Internal loading state for authentication operations.
   */
  private readonly _loadingSignal = signal<boolean>(false);

  /**
   * Internal error state for authentication operations.
   */
  private readonly _errorSignal = signal<string | null>(null);

  /**
   * Internal authentication state.
   */
  private readonly isSignedInSignal = signal<boolean>(false);

  /**
   * Internal current username state.
   */
  private readonly currentUsernameSignal = signal<string | null>(null);

  /**
   * Internal current user identifier state.
   */
  private readonly currentUserIdSignal = signal<number | null>(null);

  /**
   * Internal user collection state for future IAM administration features.
   */
  private readonly usersSignal = signal<User[]>([]);

  /**
   * Internal loading state for user administration queries.
   */
  private readonly loadingUsers = signal<boolean>(false);

  /**
   * Readonly signal indicating whether a user is signed in.
   */
  readonly isSignedIn = this.isSignedInSignal.asReadonly();

  /**
   * Readonly signal containing the current username.
   */
  readonly currentUsername = this.currentUsernameSignal.asReadonly();

  /**
   * Readonly signal containing the current numeric user identifier.
   */
  readonly currentUserId = this.currentUserIdSignal.asReadonly();

  /**
   * Computed signal containing the persisted JWT token when available.
   */
  readonly currentToken = computed(() => localStorage.getItem('token'));

  /**
   * Readonly signal containing loaded IAM users.
   */
  readonly users = this.usersSignal.asReadonly();

  /**
   * Readonly signal indicating whether an authentication operation is loading.
   */
  readonly loading = this._loadingSignal.asReadonly();

  /**
   * Readonly signal containing the current authentication error.
   */
  readonly error = this._errorSignal.asReadonly();

  /**
   * Readonly signal indicating whether user administration data is loading.
   */
  readonly isLoadingUsers = this.loadingUsers.asReadonly();

  /**
   * Creates a new IamStore instance.
   *
   * @param iamApi - Infrastructure facade for IAM HTTP operations
   */
  constructor(private readonly iamApi: IamApi) {
    this.restoreSession();
  }

  /**
   * Requests password recovery for an existing user account.
   *
   * @param command - Command containing the account username
   * @param router - Angular Router used to navigate after the request
   */
  recoverPassword(command: RecoverPasswordCommand, router: Router): void {
    this.startRequest();

    const request = this.toRecoverPasswordRequest(command);

    this.iamApi.recoverPassword(request).subscribe({
      next: () => {
        this.finishRequest();
        router.navigate(['/iam/sign-in']).then();
      },
      error: () => {
        this.failRequest('Failed to request password recovery.');
      },
    });
  }

  /**
   * Authenticates a user and persists the resulting session.
   *
   * @param command - Command containing username and password
   * @param router - Angular Router used to navigate after authentication
   */
  signIn(command: SignInCommand, router: Router): void {
    this.startRequest();

    const request = this.toSignInRequest(command);

    this.iamApi.signIn(request).subscribe({
      next: (resource) => {
        localStorage.setItem('token', resource.token);
        localStorage.setItem('userId', resource.id.toString());
        localStorage.setItem('username', resource.username);
        localStorage.setItem('roles', JSON.stringify(resource.roles));

        this.isSignedInSignal.set(true);
        this.currentUsernameSignal.set(resource.username);
        this.currentUserIdSignal.set(resource.id);
        this.finishRequest();

        if (resource.roles.includes('ROLE_QA_MANAGER')) {
          router.navigate(['/laboratories/lab-profile']).then();
        } else {
          router.navigate(['/tracking/dashboard']).then();
        }
      },
      error: () => {
        this.clearSession();
        this.failRequest('Invalid credentials. Please try again.');
        router.navigate(['/iam/sign-in']).then();
      },
    });
  }

  /**
   * Registers a new user account.
   *
   * @param command - Command containing username, password, and roles
   * @param router - Angular Router used to navigate after registration
   */
  signUp(command: SignUpCommand, router: Router): void {
    this.startRequest();

    const request = this.toSignUpRequest(command);

    this.iamApi.signUp(request).subscribe({
      next: () => {
        this.finishRequest();
        router.navigate(['/iam/sign-in']).then();
      },
      error: () => {
        this.clearSession();
        this.failRequest('Registration failed. Username may already exist.');
      },
    });
  }

  /**
   * Signs out the current user and clears the persisted session.
   *
   * @param router - Angular Router used to navigate after sign-out
   */
  signOut(router: Router): void {
    this.clearSession();
    router.navigate(['/home']).then();
  }

  /**
   * Clears the current error message.
   */
  clearError(): void {
    this._errorSignal.set(null);
  }

  /**
   * Maps a SignInCommand into the request payload expected by the API.
   *
   * @param command - Application command to map
   * @returns Infrastructure request DTO
   */
  private toSignInRequest(command: SignInCommand): SignInRequest {
    return {
      username: command.username,
      password: command.password,
    };
  }

  /**
   * Maps a SignUpCommand into the request payload expected by the API.
   *
   * @param command - Application command to map
   * @returns Infrastructure request DTO
   */
  private toSignUpRequest(command: SignUpCommand): SignUpRequest {
    return {
      username: command.username,
      password: command.password,
      roles: command.roles,
    };
  }

  /**
   * Maps a RecoverPasswordCommand into the request payload expected by the API.
   *
   * @param command - Application command to map
   * @returns Infrastructure request DTO
   */
  private toRecoverPasswordRequest(command: RecoverPasswordCommand): RecoverPasswordRequest {
    return {
      username: command.username,
    };
  }

  /**
   * Restores session state from localStorage.
   */
  private restoreSession(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (!token || !userId) {
      this.clearSession();
      return;
    }

    this.isSignedInSignal.set(true);
    this.currentUserIdSignal.set(Number(userId));
    this.currentUsernameSignal.set(username);
  }

  /**
   * Clears session state and persisted authentication data.
   */
  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');

    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
  }

  /**
   * Sets loading state and clears previous errors.
   */
  private startRequest(): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
  }

  /**
   * Clears loading state after a successful request.
   */
  private finishRequest(): void {
    this._loadingSignal.set(false);
  }

  /**
   * Stores a user-facing error message and clears loading state.
   *
   * @param message - Error message to expose to the UI
   */
  private failRequest(message: string): void {
    this._errorSignal.set(message);
    this._loadingSignal.set(false);
  }
}
