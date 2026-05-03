import { BaseResource } from '../../shared/infrastructure/base-response';

export interface RecoverPasswordResource extends BaseResource {
  message: string;
}

export interface RecoverPasswordResponse extends BaseResource, RecoverPasswordResource {}
