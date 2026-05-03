import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SignUpApiEndpoint } from './sign-up-api-endpoint';
import { SignUpAssembler } from './sign-up-assembler';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { SignUpResource } from './sign-up-response';

import { SignInApiEndpoint } from './sign-in-api-endpoint';
import { SignInAssembler } from './sign-in-assembler';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignInResource } from './sign-in-response';

import { RecoverPasswordApiEndpoint } from './recover-password-api-endpoint';
import { RecoverPasswordAssembler } from './recover-password-assembler';
import { RecoverPasswordCommand } from '../domain/model/recover-password.command';
import { RecoverPasswordResource } from './recover-password-response';

@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {
  private readonly signUpEndpoint: SignUpApiEndpoint;
  private readonly signInEndpoint: SignInApiEndpoint;
  private readonly recoverPasswordEndpoint: RecoverPasswordApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.signUpEndpoint = new SignUpApiEndpoint(http, new SignUpAssembler());
    this.signInEndpoint = new SignInApiEndpoint(http, new SignInAssembler());
    this.recoverPasswordEndpoint = new RecoverPasswordApiEndpoint(
      http,
      new RecoverPasswordAssembler(),
    );
  }

  signUp(signUpCommand: SignUpCommand): Observable<SignUpResource> {
    return this.signUpEndpoint.signUp(signUpCommand);
  }

  signIn(signInCommand: SignInCommand): Observable<SignInResource> {
    return this.signInEndpoint.signIn(signInCommand);
  }

  recoverPassword(
    recoverPasswordCommand: RecoverPasswordCommand,
  ): Observable<RecoverPasswordResource> {
    return this.recoverPasswordEndpoint.recoverPassword(recoverPasswordCommand);
  }
}
