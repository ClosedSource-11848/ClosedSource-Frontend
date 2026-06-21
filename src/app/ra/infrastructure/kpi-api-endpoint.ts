import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { KpiDashboard } from '../domain/model/kpi-dashboard.entity';
import { KpiDashboardResource, KpiDashboardsResponse } from './kpi-response';
import { KpiAssembler } from './kpi-assembler';

const kpiEndpointUrl = `${environment.serverBasePath}${environment.raKpisEndpointPath}`;

/**
 * HTTP endpoint client for KPI dashboard operations.
 *
 * @remarks
 * This endpoint encapsulates HTTP communication for KPI dashboard data within
 * the Reporting and Analysis bounded context.
 *
 * Endpoint contract:
 * - GET /kpis?laboratoryId={laboratoryId}
 */
export class KpiApiEndpoint extends BaseApiEndpoint<
  KpiDashboard,
  KpiDashboardResource,
  KpiDashboardsResponse,
  KpiAssembler
> {
  /**
   * Creates an instance of KpiApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, kpiEndpointUrl, new KpiAssembler());
  }

  /**
   * Retrieves the current KPI dashboard snapshot for a specific laboratory.
   *
   * @param laboratoryId - The unique numeric identifier of the laboratory
   * @returns Observable stream emitting the KPI dashboard domain entity
   *
   * @remarks
   * Performs a GET request using `laboratoryId` as a query parameter to match
   * the API style used by other bounded contexts.
   */
  getDashboardByLaboratory(laboratoryId: number): Observable<KpiDashboard> {
    const params = new HttpParams().set('laboratoryId', String(laboratoryId));

    return this.http.get<KpiDashboardResource>(this.endpointUrl, { params }).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to fetch KPI dashboard for laboratory ${laboratoryId}`)),
    );
  }
}
