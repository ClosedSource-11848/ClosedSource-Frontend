import { BaseResource } from '../../shared/infrastructure/base-response';

export interface SignUpResource extends BaseResource {
  id: string;
  username: string;
}

export interface SignUpResponse extends BaseResource, SignUpResource {}
