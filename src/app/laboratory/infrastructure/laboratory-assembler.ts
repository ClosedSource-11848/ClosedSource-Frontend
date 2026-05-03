import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { Laboratory } from '../domain/model/laboratory.entity';
import { LaboratoryResource } from './laboratory-response';

export class LaboratoryAssembler implements BaseAssembler<
  Laboratory,
  LaboratoryResource,
  BaseResponse
> {
  toEntityFromResource(resource: LaboratoryResource): Laboratory {
    return new Laboratory({
      id: resource.id,
      name: resource.name,
      ruc: resource.ruc,
      address: resource.address,
      phone: resource.phone,
      applicableRegulations: resource.applicableRegulations,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    });
  }

  toResourceFromEntity(entity: Laboratory): LaboratoryResource {
    return {
      id: entity.id,
      name: entity.name,
      ruc: entity.ruc,
      address: entity.address,
      phone: entity.phone,
      applicableRegulations: entity.applicableRegulations,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    } as LaboratoryResource;
  }

  toEntitiesFromResponse(response: BaseResponse): Laboratory[] {
    return [];
  }
}
