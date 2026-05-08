import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Measurement } from '../domain/model/measurement.entity';
import { MeasurementResource, MeasurementsResponse } from './measurement-response';

export class MeasurementAssembler implements BaseAssembler<
  Measurement,
  MeasurementResource,
  MeasurementsResponse
> {
  toEntitiesFromResponse(response: MeasurementsResponse): Measurement[] {
    return response.measurements.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: MeasurementResource): Measurement {
    return new Measurement({
      id: resource.id,
      equipmentId: resource.equipmentId,
      parameterName: resource.parameterName,
      value: resource.value,
      unit: resource.unit,
      timestamp: resource.timestamp,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: Measurement): MeasurementResource {
    return {
      id: entity.id,
      equipmentId: entity.equipmentId,
      parameterName: entity.parameterName,
      value: entity.value,
      unit: entity.unit,
      timestamp: entity.timestamp,
      createdAt: entity.createdAt,
    } as MeasurementResource;
  }
}
