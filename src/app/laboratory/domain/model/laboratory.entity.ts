import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Laboratory implements BaseEntity {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  applicableRegulations: string[];
  createdAt: string;
  updatedAt: string;

  constructor(params: {
    id: string;
    name: string;
    ruc: string;
    address: string;
    phone: string;
    applicableRegulations: string[];
    createdAt: string;
    updatedAt: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.ruc = params.ruc;
    this.address = params.address;
    this.phone = params.phone;
    this.applicableRegulations = params.applicableRegulations;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}
