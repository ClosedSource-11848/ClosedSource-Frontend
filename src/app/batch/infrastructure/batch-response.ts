import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface BatchResource extends BaseResource {
  id: string;
  labId: string;
  productId: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  status: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
}

export interface BatchesResponse extends BaseResponse {
  batches: BatchResource[];
}
