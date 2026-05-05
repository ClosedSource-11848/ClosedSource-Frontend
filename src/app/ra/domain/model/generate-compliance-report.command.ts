export interface GenerateComplianceReportCommand {
  labId: string;
  startDate: string;
  endDate: string;
  format: 'PDF' | 'CSV';
  requestedBy: string;
}
