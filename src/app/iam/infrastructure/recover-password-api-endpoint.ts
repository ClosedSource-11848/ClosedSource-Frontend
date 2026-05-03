import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { HttpClient } from '@angular/common/http';
import { RecoverPasswordAssembler } from './recover-password-assembler';
import { RecoverPasswordCommand } from '../domain/model/recover-password.command';
import { catchError, map, Observable } from 'rxjs';
import { RecoverPasswordResource } from './recover-password-response';

const recoverPasswordApiEndpointUrl = `${environment.serverBasePath}${environment.iamRecoverPasswordEndpointPath}`;

export class RecoverPasswordApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: RecoverPasswordAssembler,
  ) {
    super();
  }

  recoverPassword(
    recoverPasswordCommand: RecoverPasswordCommand,
  ): Observable<RecoverPasswordResource> {
    const request = this.assembler.toRequestFromCommand(recoverPasswordCommand);
    return this.http.post<RecoverPasswordResource>(recoverPasswordApiEndpointUrl, request).pipe(
      map((response) => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to request password recovery')),
    );
  }
}
