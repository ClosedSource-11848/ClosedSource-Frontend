import { RecoverPasswordResource, RecoverPasswordResponse } from './recover-password-response';
import { RecoverPasswordCommand } from '../domain/model/recover-password.command';
import { RecoverPasswordRequest } from './recover-password.request';

export class RecoverPasswordAssembler {
  toResourceFromResponse(response: RecoverPasswordResponse): RecoverPasswordResource {
    return {
      id: response.id,
      message: response.message,
    } as RecoverPasswordResource;
  }

  toRequestFromCommand(command: RecoverPasswordCommand): RecoverPasswordRequest {
    return {
      username: command.username,
    } as RecoverPasswordRequest;
  }
}
