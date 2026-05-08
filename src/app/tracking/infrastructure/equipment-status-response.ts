import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface EquipmentStatusResource extends BaseResource {
  equipmentId: string;
  isOnline: boolean;
  currentStatus: string;
  lastHeartbeat: string;
  createdAt: string;
}

export interface EquipmentStatusesResponse extends BaseResponse {
  statuses: EquipmentStatusResource[];
}
