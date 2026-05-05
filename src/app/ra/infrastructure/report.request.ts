export interface GenerateBatchReportRequest {
  batchId: string;
  includeTelemetry: boolean;
  includeDeviations: boolean;
  format: 'PDF' | 'CSV';
  requestedBy: string;
}

export interface GenerateComplianceReportRequest {
  labId: string;
  startDate: string;
  endDate: string;
  format: 'PDF' | 'CSV';
  requestedBy: string;
}

export interface ExportEquipmentLogRequest {
  equipmentId: string;
  startDate: string;
  endDate: string;
  format: 'PDF' | 'CSV';
  requestedBy: string;
}
