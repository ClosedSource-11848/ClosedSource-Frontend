import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { StaffMember } from '../domain/model/staff-member.entity';
import { StaffMemberResource, StaffMembersResponse } from './staff-response';

/**
 * Assembler responsible for mapping between {@link StaffMemberResource} API
 * response shapes and {@link StaffMember} domain entities within the
 * Laboratory domain.
 *
 * @remarks
 * `StaffAssembler` implements {@link BaseAssembler} to fulfill the mapping
 * contract required by `StaffApiEndpoint`. It acts as the translation boundary
 * between the raw server representation ({@link StaffMemberResource}) and the
 * domain model ({@link StaffMember}), ensuring that neither layer needs to be
 * aware of the other's structure.
 *
 * This class is instantiated directly by `StaffApiEndpoint` and is not managed
 * by Angular's DI container. It carries no state and all methods are pure
 * transformations with no side effects.
 *
 * @example
 * ```typescript
 * const assembler = new StaffAssembler();
 * const entity = assembler.toEntityFromResource(resource);
 * console.log(entity instanceof StaffMember); // true
 * ```
 */
export class StaffAssembler implements BaseAssembler<
StaffMember,
  StaffMemberResource,
StaffMembersResponse
> {
  /**
   * Maps a {@link StaffMembersResponse} collection response into an array
   * of {@link StaffMember} domain entities.
   *
   * @param response - The raw collection response received from the server.
   * @returns An array of {@link StaffMember} entities, one per resource
   * present in the response.
   *
   * @remarks
   * Delegates each individual mapping to {@link toEntityFromResource}, ensuring
   * consistent transformation logic across single and collection responses.
   */
  toEntitiesFromResponse(response: StaffMembersResponse): StaffMember[] {
    return response.staffMembers.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Maps a single {@link StaffMemberResource} into a {@link StaffMember}
   * domain entity.
   *
   * @param resource - The raw resource object deserialized from the server response.
   * @returns A new {@link StaffMember} instance populated with the resource data.
   *
   * @remarks
   * This is the canonical entry point for inbound server-to-domain transformations
   * within this assembler. All fields are mapped one-to-one onto the
   * {@link StaffMember} constructor parameters. Reused by
   * {@link toEntitiesFromResponse} for collection mapping.
   */
  toEntityFromResource(resource: StaffMemberResource): StaffMember {
    return new StaffMember({
      id: resource.id,
      labId: resource.labId,
      fullName: resource.fullName,
      role: resource.role,
      email: resource.email,
      active: resource.active,
      createdAt: resource.createdAt,
    });
  }

  /**
   * Maps a {@link StaffMember} domain entity into a {@link StaffMemberResource} shape.
   *
   * @param entity - The domain entity to convert into its resource representation.
   * @returns A {@link StaffMemberResource} object populated with the entity's data.
   *
   * @remarks
   * Performs the inverse transformation of {@link toEntityFromResource}. The result
   * is cast as {@link StaffMemberResource} to satisfy any additional fields inherited
   * from {@link BaseResource} that are not present on the {@link StaffMember} entity.
   */
  toResourceFromEntity(entity: StaffMember): StaffMemberResource {
    return {
      id: entity.id,
      labId: entity.labId,
      fullName: entity.fullName,
      role: entity.role,
      email: entity.email,
      active: entity.active,
      createdAt: entity.createdAt,
    } as StaffMemberResource;
  }
}
