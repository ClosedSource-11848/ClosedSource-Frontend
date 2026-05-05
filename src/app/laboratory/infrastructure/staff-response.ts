import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface StaffMemberResource extends BaseResource {
  id: string;
  labId: string;
  fullName: string;
  role: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface StaffMembersResponse extends BaseResponse {
  staffMembers: StaffMemberResource[];
}
