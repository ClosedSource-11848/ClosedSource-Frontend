import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DeviationAlert } from '../domain/model/deviation-alert.entity';
import { AlertResource, AlertsResponse } from './alert-response';

export class AlertAssembler implements BaseAssembler<
  DeviationAlert,
  AlertResource,
  AlertsResponse
> {
  toEntitiesFromResponse(response: AlertsResponse): DeviationAlert[] {
    return response.alerts.map((alert) => this.toEntityFromResource(alert));
  }

  toEntityFromResource(resource: AlertResource): DeviationAlert {
    return new DeviationAlert({
      id: resource.id,
      equipmentId: resource.equipmentId,
      batchId: resource.batchId,
      parameterName: resource.parameterName,
      recordedValue: resource.recordedValue,
      thresholdValue: resource.thresholdValue,
      unit: resource.unit,
      timestamp: resource.timestamp,
      severity: resource.severity,
      status: resource.status,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: DeviationAlert): AlertResource {
    return {
      id: entity.id,
      equipmentId: entity.equipmentId,
      batchId: entity.batchId,
      parameterName: entity.parameterName,
      recordedValue: entity.recordedValue,
      thresholdValue: entity.thresholdValue,
      unit: entity.unit,
      timestamp: entity.timestamp,
      severity: entity.severity,
      status: entity.status,
      createdAt: entity.createdAt,
    } as AlertResource;
  }
}
