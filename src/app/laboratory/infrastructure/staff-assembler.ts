import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { StaffMember } from '../domain/model/staff-member.entity';
import { StaffMemberResource } from './laboratory-response';

export class StaffAssembler implements BaseAssembler<
  StaffMember,
  StaffMemberResource,
  BaseResponse
> {
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

  toEntitiesFromResponse(response: BaseResponse): StaffMember[] {
    return [];
  }
}
