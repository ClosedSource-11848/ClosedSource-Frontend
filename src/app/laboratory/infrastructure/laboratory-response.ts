import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface LaboratoryResource extends BaseResource {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  applicableRegulations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LaboratoriesResponse extends BaseResponse {
  laboratories: LaboratoryResource[];
}
