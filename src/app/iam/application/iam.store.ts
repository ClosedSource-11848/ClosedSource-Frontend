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
 */
@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly _loadingSignal = signal<boolean>(false);
  private readonly _errorSignal = signal<string | null>(null);
  private readonly isSignedInSignal = signal<boolean>(false);
  private readonly currentUsernameSignal = signal<string | null>(null);
  private readonly currentUserIdSignal = signal<number | null>(null);
  private readonly currentLaboratoryIdSignal = signal<number | null>(null);
  private readonly usersSignal = signal<User[]>([]);
  private readonly loadingUsers = signal<boolean>(false);

  readonly isSignedIn = this.isSignedInSignal.asReadonly();
  readonly currentUsername = this.currentUsernameSignal.asReadonly();
  readonly currentUserId = this.currentUserIdSignal.asReadonly();
  readonly currentLaboratoryId = this.currentLaboratoryIdSignal.asReadonly();
  readonly currentToken = computed(() => localStorage.getItem('token'));
  readonly users = this.usersSignal.asReadonly();
  readonly loading = this._loadingSignal.asReadonly();
  readonly error = this._errorSignal.asReadonly();
  readonly isLoadingUsers = this.loadingUsers.asReadonly();

  constructor(private readonly iamApi: IamApi) {
    this.restoreSession();
  }

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

  signIn(command: SignInCommand, router: Router): void {
    this.startRequest();

    const request = this.toSignInRequest(command);

    this.iamApi.signIn(request).subscribe({
      next: (resource) => {
        this._errorSignal.set(null);

        localStorage.setItem('token', resource.token);
        localStorage.setItem('userId', resource.id.toString());
        localStorage.setItem('username', resource.username);
        localStorage.setItem('roles', JSON.stringify(resource.roles));

        if (resource.laboratoryId !== null && resource.laboratoryId !== undefined) {
          localStorage.setItem('laboratoryId', resource.laboratoryId.toString());
          this.currentLaboratoryIdSignal.set(resource.laboratoryId);
        } else {
          localStorage.removeItem('laboratoryId');
          this.currentLaboratoryIdSignal.set(null);
        }

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

  signUp(command: SignUpCommand, router: Router): void {
    this.startRequest();

    const request = this.toSignUpRequest(command);

    this.iamApi.signUp(request).subscribe({
      next: () => {
        this._errorSignal.set(null);
        this.finishRequest();
        router.navigate(['/iam/sign-in']).then();
      },
      error: () => {
        this.clearSession();
        this.failRequest('Registration failed. Username may already exist.');
      },
    });
  }

  signOut(router: Router): void {
    this.clearSession();
    router.navigate(['/home']).then();
  }

  clearError(): void {
    this._errorSignal.set(null);
  }

  private toSignInRequest(command: SignInCommand): SignInRequest {
    return {
      username: command.username,
      password: command.password,
    };
  }

  private toSignUpRequest(command: SignUpCommand): SignUpRequest {
    return {
      username: command.username,
      password: command.password,
      roles: command.roles,
      laboratoryId: command.laboratoryId,
    };
  }

  private toRecoverPasswordRequest(command: RecoverPasswordCommand): RecoverPasswordRequest {
    return {
      username: command.username,
    };
  }

  private restoreSession(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const laboratoryId = localStorage.getItem('laboratoryId');

    if (!token || !userId) {
      this.clearSession();
      return;
    }

    this.isSignedInSignal.set(true);
    this.currentUserIdSignal.set(Number(userId));
    this.currentUsernameSignal.set(username);
    this.currentLaboratoryIdSignal.set(laboratoryId ? Number(laboratoryId) : null);
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    localStorage.removeItem('laboratoryId');

    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
    this.currentLaboratoryIdSignal.set(null);
  }

  private startRequest(): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
  }

  private finishRequest(): void {
    this._loadingSignal.set(false);
  }

  private failRequest(message: string): void {
    this._errorSignal.set(message);
    this._loadingSignal.set(false);
  }
}
