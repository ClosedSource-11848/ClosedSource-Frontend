import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { PharmaceuticalProduct } from '../domain/model/pharmaceutical-product.entity';
import { PharmaceuticalProductResource, PharmaceuticalProductsResponse } from './product-response';

/**
 * Assembler responsible for mapping between {@link PharmaceuticalProductResource}
 * API response shapes and {@link PharmaceuticalProduct} domain entities within
 * the Laboratory domain.
 *
 * @remarks
 * `ProductAssembler` implements {@link BaseAssembler} to fulfill the mapping
 * contract required by `ProductApiEndpoint`. It acts as the translation boundary
 * between the raw server representation ({@link PharmaceuticalProductResource})
 * and the domain model ({@link PharmaceuticalProduct}), ensuring that neither
 * layer needs to be aware of the other's structure.
 *
 * This class is instantiated directly by `ProductApiEndpoint` and is not managed
 * by Angular's DI container. It carries no state and all methods are pure
 * transformations with no side effects.
 *
 * @example
 * ```typescript
 * const assembler = new ProductAssembler();
 * const entity = assembler.toEntityFromResource(resource);
 * console.log(entity instanceof PharmaceuticalProduct); // true
 * ```
 */
export class ProductAssembler implements BaseAssembler<
PharmaceuticalProduct,
  PharmaceuticalProductResource,
PharmaceuticalProductsResponse
> {
  /**
   * Maps a {@link PharmaceuticalProductsResponse} collection response into an
   * array of {@link PharmaceuticalProduct} domain entities.
   *
   * @param response - The raw collection response received from the server.
   * @returns An array of {@link PharmaceuticalProduct} entities, one per
   * resource present in the response.
   *
   * @remarks
   * Delegates each individual mapping to {@link toEntityFromResource}, ensuring
   * consistent transformation logic across single and collection responses.
   */
  toEntitiesFromResponse(response: PharmaceuticalProductsResponse): PharmaceuticalProduct[] {
    return response.products.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Maps a single {@link PharmaceuticalProductResource} into a
   * {@link PharmaceuticalProduct} domain entity.
   *
   * @param resource - The raw resource object deserialized from the server response.
   * @returns A new {@link PharmaceuticalProduct} instance populated with
   * the resource data.
   *
   * @remarks
   * This is the canonical entry point for inbound server-to-domain transformations
   * within this assembler. All fields are mapped one-to-one onto the
   * {@link PharmaceuticalProduct} constructor parameters. Reused by
   * {@link toEntitiesFromResponse} for collection mapping.
   */
  toEntityFromResource(resource: PharmaceuticalProductResource): PharmaceuticalProduct {
    return new PharmaceuticalProduct({
      id: resource.id,
      labId: resource.laboratoryId,
      code: resource.code,
      name: resource.name,
      description: resource.description,
      specifications: resource.specifications,
      active: resource.active,
      createdAt: resource.createdAt,
    });
  }

  /**
   * Maps a {@link PharmaceuticalProduct} domain entity into a
   * {@link PharmaceuticalProductResource} shape.
   *
   * @param entity - The domain entity to convert into its resource representation.
   * @returns A {@link PharmaceuticalProductResource} object populated with
   * the entity's data.
   *
   * @remarks
   * Performs the inverse transformation of {@link toEntityFromResource}. The result
   * is cast as {@link PharmaceuticalProductResource} to satisfy any additional fields
   * inherited from {@link BaseResource} that are not present on the
   * {@link PharmaceuticalProduct} entity.
   */
  toResourceFromEntity(entity: PharmaceuticalProduct): PharmaceuticalProductResource {
    return {
      id: entity.id,
      laboratoryId: entity.labId,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      specifications: entity.specifications,
      active: entity.active,
      createdAt: entity.createdAt,
    } as PharmaceuticalProductResource;
  }
}
