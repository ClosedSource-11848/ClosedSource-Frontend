import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { PharmaceuticalProduct } from '../domain/model/pharmaceutical-product.entity';
import { PharmaceuticalProductResource } from './laboratory-response';

export class ProductAssembler implements BaseAssembler<
  PharmaceuticalProduct,
  PharmaceuticalProductResource,
  BaseResponse
> {
  toEntityFromResource(resource: PharmaceuticalProductResource): PharmaceuticalProduct {
    return new PharmaceuticalProduct({
      id: resource.id,
      labId: resource.labId,
      code: resource.code,
      name: resource.name,
      description: resource.description,
      specifications: resource.specifications,
      active: resource.active,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: PharmaceuticalProduct): PharmaceuticalProductResource {
    return {
      id: entity.id,
      labId: entity.labId,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      specifications: entity.specifications,
      active: entity.active,
      createdAt: entity.createdAt,
    } as PharmaceuticalProductResource;
  }

  toEntitiesFromResponse(response: BaseResponse): PharmaceuticalProduct[] {
    return [];
  }
}
