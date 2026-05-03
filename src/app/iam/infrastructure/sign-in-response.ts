import { BaseResource } from '../../shared/infrastructure/base-response';

export interface SignInResource extends BaseResource {
  id: string;
  username: string;
  roles: string[];
  token: string;
}

export interface SignInResponse extends BaseResource, SignInResource {}
