import { HttpClient } from '@angular/common/http';
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
 * This endpoint encapsulates all HTTP communication for the DeviationTrend entity
 * within the Reporting and Analysis (RA) domain. It extends {@link BaseApiEndpoint}
 * to inherit standard data access patterns with trend-specific configuration.
 *
 * The endpoint handles retrieving historical parameter trends for specific
 * equipment to support predictive maintenance and quality control dashboards.
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
   *
   * @remarks
   * Initializes the endpoint with the configured server base path and the
   * deviation trends endpoint path. The DeviationTrendAssembler is used to
   * map between infrastructure resources and domain entities.
   */
  constructor(http: HttpClient) {
    super(http, trendEndpointUrl, new DeviationTrendAssembler());
  }

  /**
   * Retrieves historical deviation trends for a specific piece of equipment.
   *
   * @param equipmentId - The unique numeric identifier of the equipment
   * @returns Observable stream emitting an array of DeviationTrend domain entities
   *
   * @remarks
   * Performs a GET request to fetch the sequence of measurements and their
   * computed trend directions (STABLE, INCREASING, DECREASING) for a given asset.
   */
  getTrendsByEquipment(equipmentId: number): Observable<DeviationTrend[]> {
    return this.http
      .get<DeviationTrendsResponse>(`${this.endpointUrl}/equipment/${equipmentId}`)
      .pipe(
        map((response) => this.assembler.toEntitiesFromResponse(response)),
        catchError(
          this.handleError(`Failed to fetch deviation trends for equipment ${equipmentId}`),
        ),
      );
  }
}
