import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { KpiDashboard } from '../domain/model/kpi-dashboard.entity';
import { KpiMetric } from '../domain/model/kpi-metric.entity';
import { KpiDashboardResource, KpiDashboardsResponse } from './kpi-response';

export class KpiAssembler implements BaseAssembler<
  KpiDashboard,
  KpiDashboardResource,
  KpiDashboardsResponse
> {
  toEntitiesFromResponse(response: KpiDashboardsResponse): KpiDashboard[] {
    return response.dashboards.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: KpiDashboardResource): KpiDashboard {
    return new KpiDashboard({
      id: resource.id,
      labId: resource.labId,
      timestamp: resource.timestamp,
      overallHealthScore: resource.overallHealthScore,
      metrics: resource.metrics.map(
        (m) =>
          new KpiMetric({
            id: m.id,
            name: m.name,
            value: m.value,
            unit: m.unit,
            targetValue: m.targetValue,
            status: m.status as any,
            recordedAt: m.recordedAt,
          }),
      ),
    });
  }

  toResourceFromEntity(entity: KpiDashboard): KpiDashboardResource {
    return {
      id: entity.id,
      labId: entity.labId,
      timestamp: entity.timestamp,
      overallHealthScore: entity.overallHealthScore,
      metrics: entity.metrics.map((m) => ({
        id: m.id,
        name: m.name,
        value: m.value,
        unit: m.unit,
        targetValue: m.targetValue,
        status: m.status,
        recordedAt: m.recordedAt,
      })),
    } as KpiDashboardResource;
  }
}
