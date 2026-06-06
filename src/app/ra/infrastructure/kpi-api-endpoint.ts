import { HttpClient } from '@angular/common/http';
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
 * This endpoint encapsulates all HTTP communication for the KpiDashboard entity
 * within the Reporting and Analysis (RA) domain. It extends {@link BaseApiEndpoint}
 * to leverage standard data access patterns with KPI-specific configuration.
 *
 * The endpoint handles retrieving performance metrics and health scores
 * for specific laboratories to support operational monitoring.
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
   *
   * @remarks
   * Initializes the endpoint with the configured server base path and the
   * KPI dashboards endpoint path. The KpiAssembler is used to map between
   * infrastructure resources and domain entities.
   */
  constructor(http: HttpClient) {
    super(http, kpiEndpointUrl, new KpiAssembler());
  }

  /**
   * Retrieves the current KPI dashboard snapshot for a specific laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory
   * @returns Observable stream emitting the KpiDashboard domain entity
   *
   * @remarks
   * Performs a GET request to fetch the aggregated performance metrics
   * and overall health score for a given lab facility.
   */
  getDashboardByLab(labId: number): Observable<KpiDashboard> {
    return this.http.get<KpiDashboardResource>(`${this.endpointUrl}/lab/${labId}`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to fetch KPI Dashboard for lab ${labId}`)),
    );
  }
}
