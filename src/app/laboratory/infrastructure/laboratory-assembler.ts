import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Laboratory } from '../domain/model/laboratory.entity';
import { LaboratoryResource, LaboratoriesResponse } from './laboratory-response';

export class LaboratoryAssembler implements BaseAssembler<
  Laboratory,
  LaboratoryResource,
  LaboratoriesResponse
> {
  toEntitiesFromResponse(response: LaboratoriesResponse): Laboratory[] {
    return response.laboratories.map((resource) => this.toEntityFromResource(resource));
  }

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
}
