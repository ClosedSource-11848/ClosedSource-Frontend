import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface MaintenanceResource extends BaseResource {
  id: string;
  equipmentId: string;
  maintenanceDate: string;
  technicianName: string;
  description: string;
  type: string;
  createdAt: string;
}

export interface MaintenancesResponse extends BaseResponse {
  maintenances: MaintenanceResource[];
}
