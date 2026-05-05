import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { KpiDashboard } from '../domain/model/kpi-dashboard.entity';
import { KpiDashboardResource, KpiDashboardsResponse } from './kpi-response';
import { KpiAssembler } from './kpi-assembler';

const kpiEndpointUrl = `${environment.serverBasePath}${environment.raKpisEndpointPath}`;

export class KpiApiEndpoint extends BaseApiEndpoint<
  KpiDashboard,
  KpiDashboardResource,
  KpiDashboardsResponse,
  KpiAssembler
> {
  constructor(http: HttpClient) {
    super(http, kpiEndpointUrl, new KpiAssembler());
  }

  getDashboardByLab(labId: string): Observable<KpiDashboard> {
    return this.http.get<KpiDashboardResource>(`${this.endpointUrl}/lab/${labId}`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to fetch KPI Dashboard for lab ${labId}`)),
    );
  }
}
