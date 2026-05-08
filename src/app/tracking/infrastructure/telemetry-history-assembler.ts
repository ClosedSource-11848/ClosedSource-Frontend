import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { TelemetryHistoryPoint } from '../domain/model/telemetry-history-point.entity';
import {
  TelemetryHistoryPointResource,
  TelemetryHistoryResponse,
} from './telemetry-history-response';

export class TelemetryHistoryAssembler implements BaseAssembler<
  TelemetryHistoryPoint,
  TelemetryHistoryPointResource,
  TelemetryHistoryResponse
> {
  toEntitiesFromResponse(response: TelemetryHistoryResponse): TelemetryHistoryPoint[] {
    return response.historyPoints.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: TelemetryHistoryPointResource): TelemetryHistoryPoint {
    return new TelemetryHistoryPoint({
      id: resource.id,
      equipmentId: resource.equipmentId,
      parameterName: resource.parameterName,
      recordedValue: resource.recordedValue,
      timestamp: resource.timestamp,
      isAnomaly: resource.isAnomaly,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: TelemetryHistoryPoint): TelemetryHistoryPointResource {
    return {
      id: entity.id,
      equipmentId: entity.equipmentId,
      parameterName: entity.parameterName,
      recordedValue: entity.recordedValue,
      timestamp: entity.timestamp,
      isAnomaly: entity.isAnomaly,
      createdAt: entity.createdAt,
    } as TelemetryHistoryPointResource;
  }
}
