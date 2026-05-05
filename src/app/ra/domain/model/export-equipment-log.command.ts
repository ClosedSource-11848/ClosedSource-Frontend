export interface ExportEquipmentLogCommand {
  equipmentId: string;
  startDate: string;
  endDate: string;
  format: 'PDF' | 'CSV';
  requestedBy: string;
}
