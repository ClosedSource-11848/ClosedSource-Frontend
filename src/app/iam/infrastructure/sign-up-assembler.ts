import { SignUpResource, SignUpResponse } from './sign-up-response';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { SignUpRequest } from './sign-up.request';

export class SignUpAssembler {
  toResourceFromResponse(response: SignUpResponse): SignUpResource {
    return {
      id: response.id,
      username: response.username,
    } as SignUpResource;
  }

  toRequestFromCommand(command: SignUpCommand): SignUpRequest {
    return {
      username: command.username,
      password: command.password,
      roles: command.roles,
    } as SignUpRequest;
  }
}
