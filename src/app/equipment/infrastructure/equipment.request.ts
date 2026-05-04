export interface RegisterEquipmentRequest {
  labId: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
}

export interface ConfigureBpmRequest {
  equipmentId: string;
  parameterName: string;
  minValue: number;
  maxValue: number;
  unit: string;
}

export interface RegisterMaintenanceRequest {
  equipmentId: string;
  maintenanceDate: string;
  technicianName: string;
  description: string;
  type: string;
}
