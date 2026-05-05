export interface RegisterMaintenanceRequest {
  equipmentId: string;
  maintenanceDate: string;
  technicianName: string;
  description: string;
  type: string;
}
