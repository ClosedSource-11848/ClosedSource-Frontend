import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface RawMaterialResource extends BaseResource {
  id: string;
  labId: string;
  name: string;
  code: string;
  supplier: string;
  batchNumber: string;
  expirationDate: string;
  quantityInStock: number;
  unit: string;
  minimumStock: number;
  createdAt: string;
}

export interface RawMaterialsResponse extends BaseResponse {
  rawMaterials: RawMaterialResource[];
}
