import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class MaintenanceRecord implements BaseEntity {
  id: string;
  equipmentId: string;
  maintenanceDate: string;
  technicianName: string;
  description: string;
  type: string;
  createdAt: string;

  constructor(params: {
    id: string;
    equipmentId: string;
    maintenanceDate: string;
    technicianName: string;
    description: string;
    type: string;
    createdAt: string;
  }) {
    this.id = params.id;
    this.equipmentId = params.equipmentId;
    this.maintenanceDate = params.maintenanceDate;
    this.technicianName = params.technicianName;
    this.description = params.description;
    this.type = params.type;
    this.createdAt = params.createdAt;
  }
}
