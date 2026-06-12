import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { DeviationTrend } from '../domain/model/deviation-trend.entity';
import { DeviationTrendResource, DeviationTrendsResponse } from './deviation-trend-response';
import { DeviationTrendAssembler } from './deviation-trend-assembler';

const trendEndpointUrl = `${environment.serverBasePath}${environment.raDeviationTrendsEndpointPath}`;

/**
 * HTTP endpoint client for deviation trend analysis operations.
 *
 * @remarks
 * This endpoint encapsulates HTTP communication for deviation trend data within
 * the Reporting and Analysis bounded context.
 *
 * Endpoint contract:
 * - GET /deviation-trends?equipmentId={equipmentId}
 */
export class DeviationTrendApiEndpoint extends BaseApiEndpoint<
  DeviationTrend,
  DeviationTrendResource,
  DeviationTrendsResponse,
  DeviationTrendAssembler
> {
  /**
   * Creates an instance of DeviationTrendApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, trendEndpointUrl, new DeviationTrendAssembler());
  }

  /**
   * Retrieves historical deviation trends for a specific equipment.
   *
   * @param equipmentId - The unique numeric identifier of the equipment
   * @returns Observable stream emitting an array of deviation trend domain entities
   *
   * @remarks
   * Performs a GET request using `equipmentId` as a query parameter and expects
   * a direct array response from the backend.
   */
  getTrendsByEquipment(equipmentId: number): Observable<DeviationTrend[]> {
    const params = new HttpParams().set('equipmentId', String(equipmentId));

    return this.http.get<DeviationTrendResource[]>(this.endpointUrl, { params }).pipe(
      map((resources) => this.assembler.toEntitiesFromResources(resources)),
      catchError(this.handleError(`Failed to fetch deviation trends for equipment ${equipmentId}`)),
    );
  }
}
