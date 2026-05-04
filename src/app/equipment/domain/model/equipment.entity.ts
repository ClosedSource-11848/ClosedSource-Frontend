import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Equipment implements BaseEntity {
  id: string;
  labId: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  status: string; // OPERATIONAL, MAINTENANCE, etc.
  createdAt: string;

  constructor(params: {
    id: string;
    labId: string;
    name: string;
    type: string;
    model: string;
    serialNumber: string;
    status: string;
    createdAt: string;
  }) {
    this.id = params.id;
    this.labId = params.labId;
    this.name = params.name;
    this.type = params.type;
    this.model = params.model;
    this.serialNumber = params.serialNumber;
    this.status = params.status;
    this.createdAt = params.createdAt;
  }
}
