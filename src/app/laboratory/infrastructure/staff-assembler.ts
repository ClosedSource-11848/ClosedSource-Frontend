import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { StaffMember } from '../domain/model/staff-member.entity';
import { StaffMemberResource, StaffMembersResponse } from './staff-response';

export class StaffAssembler implements BaseAssembler<
  StaffMember,
  StaffMemberResource,
  StaffMembersResponse
> {
  toEntitiesFromResponse(response: StaffMembersResponse): StaffMember[] {
    return response.staffMembers.map((resource) => this.toEntityFromResource(resource));
  }

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
