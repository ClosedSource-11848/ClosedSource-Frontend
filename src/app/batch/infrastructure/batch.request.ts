export interface CreateBatchRequest {
  labId: string;
  productId: string;
  batchNumber: string;
  quantity: number;
  startDate: string;
  notes?: string;
}

export interface ReleaseBatchRequest {
  releaseDate: string;
  notes: string;
}

export interface RejectBatchRequest {
  rejectionDate: string;
  reason: string;
}
