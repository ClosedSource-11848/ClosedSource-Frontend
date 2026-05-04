import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { MaintenanceRecord } from '../domain/model/maintenance-record.entity';
import { MaintenanceResource } from './equipment-response';

export class MaintenanceAssembler implements BaseAssembler<
  MaintenanceRecord,
  MaintenanceResource,
  BaseResponse
> {
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

  toEntitiesFromResponse(response: BaseResponse): MaintenanceRecord[] {
    return [];
  }
}
