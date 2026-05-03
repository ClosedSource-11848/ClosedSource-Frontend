import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class StaffMember implements BaseEntity {
  id: string;
  labId: string;
  fullName: string;
  role: string;
  email: string;
  active: boolean;
  createdAt: string;

  constructor(params: {
    id: string;
    labId: string;
    fullName: string;
    role: string;
    email: string;
    active: boolean;
    createdAt: string;
  }) {
    this.id = params.id;
    this.labId = params.labId;
    this.fullName = params.fullName;
    this.role = params.role;
    this.email = params.email;
    this.active = params.active;
    this.createdAt = params.createdAt;
  }
}
