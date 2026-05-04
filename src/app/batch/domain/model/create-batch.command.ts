export interface CreateBatchCommand {
  labId: string;
  productId: string;
  batchNumber: string;
  quantity: number;
  startDate: string;
  notes?: string;
}
