import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { EquipmentStatus } from '../domain/model/equipment-status.entity';
import { EquipmentStatusResource, EquipmentStatusesResponse } from './equipment-status-response';

export class EquipmentStatusAssembler implements BaseAssembler<
  EquipmentStatus,
  EquipmentStatusResource,
  EquipmentStatusesResponse
> {
  toEntitiesFromResponse(response: EquipmentStatusesResponse): EquipmentStatus[] {
    return response.statuses.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: EquipmentStatusResource): EquipmentStatus {
    return new EquipmentStatus({
      id: resource.id,
      equipmentId: resource.equipmentId,
      isOnline: resource.isOnline,
      currentStatus: resource.currentStatus as any,
      lastHeartbeat: resource.lastHeartbeat,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: EquipmentStatus): EquipmentStatusResource {
    return {
      id: entity.id,
      equipmentId: entity.equipmentId,
      isOnline: entity.isOnline,
      currentStatus: entity.currentStatus,
      lastHeartbeat: entity.lastHeartbeat,
      createdAt: entity.createdAt,
    } as EquipmentStatusResource;
  }
}
