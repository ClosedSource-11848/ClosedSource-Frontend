export interface RegisterMaintenanceCommand {
  equipmentId: string;
  maintenanceDate: string;
  technicianName: string;
  description: string;
  type: string;
}
