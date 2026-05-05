import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface RawMaterialUsageResource extends BaseResource {
  id: string;
  batchId: string;
  rawMaterialId: string;
  rawMaterialName: string;
  quantityUsed: number;
  unit: string;
  usageDate: string;
  createdAt: string;
}

export interface RawMaterialUsagesResponse extends BaseResponse {
  rawMaterialUsages: RawMaterialUsageResource[];
}
