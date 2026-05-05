import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { MaintenanceRecord } from '../domain/model/maintenance-record.entity';
import { MaintenanceResource, MaintenancesResponse } from './maintenance-response';

export class MaintenanceAssembler implements BaseAssembler<
  MaintenanceRecord,
  MaintenanceResource,
  MaintenancesResponse
> {
  toEntitiesFromResponse(response: MaintenancesResponse): MaintenanceRecord[] {
    return response.maintenances.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: MaintenanceResource): MaintenanceRecord {
    return new MaintenanceRecord({
      id: resource.id,
      equipmentId: resource.equipmentId,
      maintenanceDate: resource.maintenanceDate,
      technicianName: resource.technicianName,
      description: resource.description,
      type: resource.type,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: MaintenanceRecord): MaintenanceResource {
    return {
      id: entity.id,
      equipmentId: entity.equipmentId,
      maintenanceDate: entity.maintenanceDate,
      technicianName: entity.technicianName,
      description: entity.description,
      type: entity.type,
      createdAt: entity.createdAt,
    } as MaintenanceResource;
  }
}
