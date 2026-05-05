import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { DeviationTrend } from '../domain/model/deviation-trend.entity';
import { DeviationTrendResource, DeviationTrendsResponse } from './deviation-trend-response';
import { DeviationTrendAssembler } from './deviation-trend-assembler';

const trendEndpointUrl = `${environment.serverBasePath}${environment.raDeviationTrendsEndpointPath}`;

export class DeviationTrendApiEndpoint extends BaseApiEndpoint<
  DeviationTrend,
  DeviationTrendResource,
  DeviationTrendsResponse,
  DeviationTrendAssembler
> {
  constructor(http: HttpClient) {
    super(http, trendEndpointUrl, new DeviationTrendAssembler());
  }

  getTrendsByEquipment(equipmentId: string): Observable<DeviationTrend[]> {
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
