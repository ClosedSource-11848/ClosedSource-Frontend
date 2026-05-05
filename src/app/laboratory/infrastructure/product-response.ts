import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface PharmaceuticalProductResource extends BaseResource {
  id: string;
  labId: string;
  code: string;
  name: string;
  description: string;
  specifications: string;
  active: boolean;
  createdAt: string;
}

export interface PharmaceuticalProductsResponse extends BaseResponse {
  products: PharmaceuticalProductResource[];
}
