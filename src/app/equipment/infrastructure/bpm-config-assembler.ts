import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BpmParameterConfig } from '../domain/model/bpm-parameter-config.entity';
import { BpmConfigResource, BpmConfigsResponse } from './bpm-config-response';

export class BpmConfigAssembler implements BaseAssembler<
  BpmParameterConfig,
  BpmConfigResource,
  BpmConfigsResponse
> {
  toEntitiesFromResponse(response: BpmConfigsResponse): BpmParameterConfig[] {
    return response.bpmConfigs.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: BpmConfigResource): BpmParameterConfig {
    return new BpmParameterConfig({
      id: resource.id,
      equipmentId: resource.equipmentId,
      parameterName: resource.parameterName,
      minValue: resource.minValue,
      maxValue: resource.maxValue,
      unit: resource.unit,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: BpmParameterConfig): BpmConfigResource {
    return {
      id: entity.id,
      equipmentId: entity.equipmentId,
      parameterName: entity.parameterName,
      minValue: entity.minValue,
      maxValue: entity.maxValue,
      unit: entity.unit,
      createdAt: entity.createdAt,
    } as BpmConfigResource;
  }
}
