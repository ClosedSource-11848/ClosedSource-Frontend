import { BaseResource } from '../../shared/infrastructure/base-response';

export interface BatchResource extends BaseResource {
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

export interface RawMaterialUsageResource extends BaseResource {
  batchId: string;
  rawMaterialId: string;
  rawMaterialName: string;
  quantityUsed: number;
  unit: string;
  usageDate: string;
  createdAt: string;
}
