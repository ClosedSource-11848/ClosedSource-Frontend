import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { Equipment } from '../domain/model/equipment.entity';
import { EquipmentResource } from './equipment-response';

export class EquipmentAssembler implements BaseAssembler<
  Equipment,
  EquipmentResource,
  BaseResponse
> {
  toEntityFromResource(resource: EquipmentResource): Equipment {
    return new Equipment({
      id: resource.id,
      labId: resource.labId,
      name: resource.name,
      type: resource.type,
      model: resource.model,
      serialNumber: resource.serialNumber,
      status: resource.status,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: Equipment): EquipmentResource {
    return {
      id: entity.id,
      labId: entity.labId,
      name: entity.name,
      type: entity.type,
      model: entity.model,
      serialNumber: entity.serialNumber,
      status: entity.status,
      createdAt: entity.createdAt,
    } as EquipmentResource;
  }

  toEntitiesFromResponse(response: BaseResponse): Equipment[] {
    return [];
  }
}
