import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DeviationTrend } from '../domain/model/deviation-trend.entity';
import { DeviationTrendResource, DeviationTrendsResponse } from './deviation-trend-response';

export class DeviationTrendAssembler implements BaseAssembler<
  DeviationTrend,
  DeviationTrendResource,
  DeviationTrendsResponse
> {
  toEntitiesFromResponse(response: DeviationTrendsResponse): DeviationTrend[] {
    return response.trends.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: DeviationTrendResource): DeviationTrend {
    return new DeviationTrend({
      id: resource.id,
      parameterName: resource.parameterName,
      equipmentId: resource.equipmentId,
      trendDirection: resource.trendDirection as any,
      dataPoints: resource.dataPoints,
    });
  }

  toResourceFromEntity(entity: DeviationTrend): DeviationTrendResource {
    return {
      id: entity.id,
      parameterName: entity.parameterName,
      equipmentId: entity.equipmentId,
      trendDirection: entity.trendDirection,
      dataPoints: entity.dataPoints,
    } as DeviationTrendResource;
  }
}
