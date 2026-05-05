export interface GenerateBatchReportCommand {
  batchId: string;
  includeTelemetry: boolean;
  includeDeviations: boolean;
  format: 'PDF' | 'CSV';
  requestedBy: string;
}
