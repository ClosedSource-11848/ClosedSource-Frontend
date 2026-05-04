import { BaseResource } from '../../shared/infrastructure/base-response';

export interface EquipmentResource extends BaseResource {
  labId: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  status: string;
  createdAt: string;
}

export interface BpmConfigResource extends BaseResource {
  equipmentId: string;
  parameterName: string;
  minValue: number;
  maxValue: number;
  unit: string;
  createdAt: string;
}

export interface MaintenanceResource extends BaseResource {
  equipmentId: string;
  maintenanceDate: string;
  technicianName: string;
  description: string;
  type: string;
  createdAt: string;
}
