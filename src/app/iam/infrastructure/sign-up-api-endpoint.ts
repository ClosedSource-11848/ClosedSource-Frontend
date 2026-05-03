import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { HttpClient } from '@angular/common/http';
import { SignUpAssembler } from './sign-up-assembler';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { catchError, map, Observable } from 'rxjs';
import { SignUpResource } from './sign-up-response';

const signUpApiEndpointUrl = `${environment.serverBasePath}${environment.iamSignUpEndpointPath}`;

export class SignUpApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: SignUpAssembler,
  ) {
    super();
  }

  signUp(signUpCommand: SignUpCommand): Observable<SignUpResource> {
    const signUpRequest = this.assembler.toRequestFromCommand(signUpCommand);
    return this.http.post<SignUpResource>(signUpApiEndpointUrl, signUpRequest).pipe(
      map((response) => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to sign-up')),
    );
  }
}
