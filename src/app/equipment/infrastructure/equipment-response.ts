import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface EquipmentResource extends BaseResource {
  id: string;
  labId: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  status: string;
  createdAt: string;
}

export interface EquipmentsResponse extends BaseResponse {
  equipments: EquipmentResource[];
}
