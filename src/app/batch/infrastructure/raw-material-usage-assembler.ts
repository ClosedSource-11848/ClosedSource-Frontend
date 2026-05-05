import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { RawMaterialUsage } from '../domain/model/raw-material-usage.entity';
import { RawMaterialUsageResource, RawMaterialUsagesResponse } from './raw-material-usage-response';

export class RawMaterialUsageAssembler implements BaseAssembler<
  RawMaterialUsage,
  RawMaterialUsageResource,
  RawMaterialUsagesResponse
> {
  toEntitiesFromResponse(response: RawMaterialUsagesResponse): RawMaterialUsage[] {
    return response.rawMaterialUsages.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: RawMaterialUsageResource): RawMaterialUsage {
    return new RawMaterialUsage({
      id: resource.id,
      batchId: resource.batchId,
      rawMaterialId: resource.rawMaterialId,
      rawMaterialName: resource.rawMaterialName,
      quantityUsed: resource.quantityUsed,
      unit: resource.unit,
      usageDate: resource.usageDate,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: RawMaterialUsage): RawMaterialUsageResource {
    return {
      id: entity.id,
      batchId: entity.batchId,
      rawMaterialId: entity.rawMaterialId,
      rawMaterialName: entity.rawMaterialName,
      quantityUsed: entity.quantityUsed,
      unit: entity.unit,
      usageDate: entity.usageDate,
      createdAt: entity.createdAt,
    } as RawMaterialUsageResource;
  }
}
