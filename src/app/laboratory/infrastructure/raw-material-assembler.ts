import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { RawMaterial } from '../domain/model/raw-material.entity';
import { RawMaterialResource, RawMaterialsResponse } from './raw-material-response';

export class RawMaterialAssembler implements BaseAssembler<
  RawMaterial,
  RawMaterialResource,
  RawMaterialsResponse
> {
  toEntitiesFromResponse(response: RawMaterialsResponse): RawMaterial[] {
    return response.rawMaterials.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: RawMaterialResource): RawMaterial {
    return new RawMaterial({
      id: resource.id,
      labId: resource.labId,
      name: resource.name,
      code: resource.code,
      supplier: resource.supplier,
      batchNumber: resource.batchNumber,
      expirationDate: resource.expirationDate,
      quantityInStock: resource.quantityInStock,
      unit: resource.unit,
      minimumStock: resource.minimumStock,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: RawMaterial): RawMaterialResource {
    return {
      id: entity.id,
      labId: entity.labId,
      name: entity.name,
      code: entity.code,
      supplier: entity.supplier,
      batchNumber: entity.batchNumber,
      expirationDate: entity.expirationDate,
      quantityInStock: entity.quantityInStock,
      unit: entity.unit,
      minimumStock: entity.minimumStock,
      createdAt: entity.createdAt,
    } as RawMaterialResource;
  }
}
