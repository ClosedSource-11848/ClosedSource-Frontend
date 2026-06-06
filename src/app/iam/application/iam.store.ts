import { computed, Injectable, signal } from '@angular/core';
import { User } from '../domain/model/user.entity';
import { SignInCommand } from '../domain/model/sign-in.command';
import { Router } from '@angular/router';
import { IamApi } from '../infrastructure/iam-api';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { RecoverPasswordCommand } from '../domain/model/recover-password.command';

/**
 * @summary Store reactivo para la gestión de identidad y accesos de QualiTrack.
 * @remarks Utiliza Angular Signals para manejar el estado de la sesión,
 * la carga y los errores de forma reactiva en toda la aplicación.
 * @author QualiTrack
 */
@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly _loadingSignal = signal<boolean>(false);
  private readonly _errorSignal = signal<string | null>(null);
  private readonly isSignedInSignal = signal<boolean>(false);
  private readonly currentUsernameSignal = signal<string | null>(null);
  private readonly currentUserIdSignal = signal<number | null>(null);
  private readonly usersSignal = signal<Array<User>>([]);

  readonly isSignedIn = this.isSignedInSignal.asReadonly();
  readonly loadingUsers = signal<boolean>(false);
  readonly currentUsername = this.currentUsernameSignal.asReadonly();
  readonly currentUserId = this.currentUserIdSignal.asReadonly();
  readonly currentToken = computed(() =>
    this.isSignedIn() ? localStorage.getItem('token') : null,
  );
  readonly users = this.usersSignal.asReadonly();
  readonly loading = this._loadingSignal.asReadonly();
  readonly error = this._errorSignal.asReadonly();
  readonly isLoadingUsers = this.loadingUsers.asReadonly();

  constructor(private iamApi: IamApi) {
    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
  }

  recoverPassword(recoverPasswordCommand: RecoverPasswordCommand, router: Router) {
    this._loadingSignal.set(true);
    this.iamApi.recoverPassword(recoverPasswordCommand).subscribe({
      next: (resource) => {
        console.log('Password recovery requested:', resource);
        this._loadingSignal.set(false);
        router.navigate(['/iam/sign-in']).then();
      },
      error: (err) => {
        console.error('Password recovery failed:', err);
        this._errorSignal.set('Failed to request password recovery.');
        this._loadingSignal.set(false);
      },
    });
  }

  signIn(signInCommand: SignInCommand, router: Router) {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);

    this.iamApi.signIn(signInCommand).subscribe({
      next: (signInResource) => {
        localStorage.setItem('token', signInResource.token);
        localStorage.setItem('userId', signInResource.id.toString());

        this.isSignedInSignal.set(true);
        this.currentUsernameSignal.set(signInResource.username);
        this.currentUserIdSignal.set(signInResource.id);
        this._loadingSignal.set(false);

        if (signInResource.roles.includes('ROLE_QA_MANAGER')) {
          router.navigate(['/laboratory-management/lab-profile']).then();
        } else {
          router.navigate(['/tracking/dashboard']).then();
        }
      },
      error: (err) => {
        console.error('Sign-in failed:', err);
        this.isSignedInSignal.set(false);
        this.currentUsernameSignal.set(null);
        this.currentUserIdSignal.set(null);
        this._loadingSignal.set(false);
        this._errorSignal.set('Invalid credentials. Please try again.');
        router.navigate(['/iam/sign-in']).then();
      },
    });
  }

  signUp(signUpCommand: SignUpCommand, router: Router) {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);

    this.iamApi.signUp(signUpCommand).subscribe({
      next: (signUpResource) => {
        console.log('Sign-up successful:', signUpResource);
        this._loadingSignal.set(false);
        router.navigate(['/iam/sign-in']).then();
      },
      error: (err) => {
        console.error('Sign-up failed:', err);
        this.isSignedInSignal.set(false);
        this.currentUsernameSignal.set(null);
        this.currentUserIdSignal.set(null);
        this._loadingSignal.set(false);
        this._errorSignal.set('Registration failed. Username may already exist.');
      },
    });
  }

  signOut(router: Router) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);

    router.navigate(['/home']).then();
  }
}
