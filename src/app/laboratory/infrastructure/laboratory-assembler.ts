import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Laboratory } from '../domain/model/laboratory.entity';
import { LaboratoryResource, LaboratoriesResponse } from './laboratory-response';

/**
 * Assembler responsible for mapping between {@link LaboratoryResource} API response
 * shapes and {@link Laboratory} domain entities within the Laboratory domain.
 *
 * @remarks
 * `LaboratoryAssembler` implements {@link BaseAssembler} to fulfill the mapping
 * contract required by {@link LaboratoryApiEndpoint}. It acts as the translation
 * boundary between the raw server representation ({@link LaboratoryResource}) and
 * the domain model ({@link Laboratory}), ensuring that neither layer needs to be
 * aware of the other's structure.
 *
 * This class is instantiated directly by {@link LaboratoryApiEndpoint} and is not
 * managed by Angular's DI container. It carries no state and all methods are
 * pure transformations with no side effects.
 *
 * @example
 * ```typescript
 * const assembler = new LaboratoryAssembler();
 * const entity = assembler.toEntityFromResource(resource);
 * console.log(entity instanceof Laboratory); // true
 * ```
 */
export class LaboratoryAssembler implements BaseAssembler<
Laboratory,
  LaboratoryResource,
LaboratoriesResponse
> {
  /**
   * Maps a {@link LaboratoriesResponse} collection response into an array
   * of {@link Laboratory} domain entities.
   *
   * @param response - The raw collection response received from the server.
   * @returns An array of {@link Laboratory} entities, one per resource in the response.
   *
   * @remarks
   * Delegates each individual mapping to {@link toEntityFromResource}, ensuring
   * consistent transformation logic across single and collection responses.
   */
  toEntitiesFromResponse(response: LaboratoriesResponse): Laboratory[] {
    return response.laboratories.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Maps a single {@link LaboratoryResource} into a {@link Laboratory} domain entity.
   *
   * @param resource - The raw resource object deserialized from the server response.
   * @returns A new {@link Laboratory} instance populated with the resource data.
   *
   * @remarks
   * This is the canonical entry point for inbound server-to-domain transformations
   * within this assembler. All fields are mapped one-to-one onto the {@link Laboratory}
   * constructor parameters. Reused by {@link toEntitiesFromResponse} for collection mapping.
   */
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

  /**
   * Maps a {@link Laboratory} domain entity into a {@link LaboratoryResource} shape.
   *
   * @param entity - The domain entity to convert into its resource representation.
   * @returns A {@link LaboratoryResource} object populated with the entity's data.
   *
   * @remarks
   * Performs the inverse transformation of {@link toEntityFromResource}. The result
   * is cast as {@link LaboratoryResource} to satisfy any additional fields inherited
   * from {@link BaseResource} that are not present on the {@link Laboratory} entity.
   */
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
