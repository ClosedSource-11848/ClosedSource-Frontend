import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { RawMaterial } from '../domain/model/raw-material.entity';
import { RawMaterialResource, RawMaterialsResponse } from './raw-material-response';

/**
 * Assembler responsible for mapping between {@link RawMaterialResource} API
 * response shapes and {@link RawMaterial} domain entities within the
 * Laboratory domain.
 *
 * @remarks
 * `RawMaterialAssembler` implements {@link BaseAssembler} to fulfill the mapping
 * contract required by `RawMaterialApiEndpoint`. It acts as the translation
 * boundary between the raw server representation ({@link RawMaterialResource})
 * and the domain model ({@link RawMaterial}), ensuring that neither layer needs
 * to be aware of the other's structure.
 *
 * This class is instantiated directly by `RawMaterialApiEndpoint` and is not
 * managed by Angular's DI container. It carries no state and all methods are
 * pure transformations with no side effects.
 *
 * @example
 * ```typescript
 * const assembler = new RawMaterialAssembler();
 * const entity = assembler.toEntityFromResource(resource);
 * console.log(entity instanceof RawMaterial); // true
 * ```
 */
export class RawMaterialAssembler implements BaseAssembler<
RawMaterial,
  RawMaterialResource,
RawMaterialsResponse
> {
  /**
   * Maps a {@link RawMaterialsResponse} collection response into an array
   * of {@link RawMaterial} domain entities.
   *
   * @param response - The raw collection response received from the server.
   * @returns An array of {@link RawMaterial} entities, one per resource
   * present in the response.
   *
   * @remarks
   * Delegates each individual mapping to {@link toEntityFromResource}, ensuring
   * consistent transformation logic across single and collection responses.
   */
  toEntitiesFromResponse(response: RawMaterialsResponse): RawMaterial[] {
    return response.rawMaterials.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Maps a single {@link RawMaterialResource} into a {@link RawMaterial}
   * domain entity.
   *
   * @param resource - The raw resource object deserialized from the server response.
   * @returns A new {@link RawMaterial} instance populated with the resource data.
   *
   * @remarks
   * This is the canonical entry point for inbound server-to-domain transformations
   * within this assembler. All fields are mapped one-to-one onto the
   * {@link RawMaterial} constructor parameters. Reused by
   * {@link toEntitiesFromResponse} for collection mapping.
   */
  toEntityFromResource(resource: RawMaterialResource): RawMaterial {
    return new RawMaterial({
      id: resource.id,
      labId: resource.laboratoryId,
      name: resource.name,
      code: resource.code,
      supplier: resource.supplier,
      batchNumber: resource.batchNumber,
      expirationDate: resource.expirationDate,
      quantityInStock: resource.currentStock,
      unit: resource.unit,
      minimumStock: resource.minimumThreshold,
      createdAt: resource.createdAt,
    });
  }

  /**
   * Maps a {@link RawMaterial} domain entity into a {@link RawMaterialResource} shape.
   *
   * @param entity - The domain entity to convert into its resource representation.
   * @returns A {@link RawMaterialResource} object populated with the entity's data.
   *
   * @remarks
   * Performs the inverse transformation of {@link toEntityFromResource}. The result
   * is cast as {@link RawMaterialResource} to satisfy any additional fields inherited
   * from {@link BaseResource} that are not present on the {@link RawMaterial} entity.
   */
  toResourceFromEntity(entity: RawMaterial): RawMaterialResource {
    return {
      id: entity.id,
      laboratoryId: entity.labId,
      name: entity.name,
      code: entity.code,
      supplier: entity.supplier,
      batchNumber: entity.batchNumber,
      expirationDate: entity.expirationDate,
      currentStock: entity.quantityInStock,
      unit: entity.unit,
      minimumThreshold: entity.minimumStock,
      createdAt: entity.createdAt,
    } as RawMaterialResource;
  }
}
