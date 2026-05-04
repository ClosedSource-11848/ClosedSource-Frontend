export interface RejectBatchCommand {
  batchId: string;
  rejectionDate: string;
  reason: string; // Motivo del rechazo según BPM
}
