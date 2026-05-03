import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class PharmaceuticalProduct implements BaseEntity {
  id: string;
  labId: string;
  code: string;
  name: string;
  description: string;
  specifications: string;
  active: boolean;
  createdAt: string;

  constructor(params: {
    id: string;
    labId: string;
    code: string;
    name: string;
    description: string;
    specifications: string;
    active: boolean;
    createdAt: string;
  }) {
    this.id = params.id;
    this.labId = params.labId;
    this.code = params.code;
    this.name = params.name;
    this.description = params.description;
    this.specifications = params.specifications;
    this.active = params.active;
    this.createdAt = params.createdAt;
  }
}
