import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { RawMaterialUsage } from '../domain/model/raw-material-usage.entity';
import { RawMaterialUsageResource, RawMaterialUsagesResponse } from './raw-material-usage-response';
import { RawMaterialUsageAssembler } from './raw-material-usage-assembler';
import { LinkRawMaterialRequest } from './raw-material-usage.request';

const usageEndpointUrl = `${environment.serverBasePath}${environment.batchRawMaterialUsageEndpointPath}`;

export class RawMaterialUsageApiEndpoint extends BaseApiEndpoint<
  RawMaterialUsage,
  RawMaterialUsageResource,
  RawMaterialUsagesResponse,
  RawMaterialUsageAssembler
> {
  constructor(http: HttpClient) {
    super(http, usageEndpointUrl, new RawMaterialUsageAssembler());
  }

  getUsageByBatch(batchId: string): Observable<RawMaterialUsage[]> {
    return this.http
      .get<RawMaterialUsagesResponse>(`${this.endpointUrl}/${batchId}/materials`)
      .pipe(
        map((response) => this.assembler.toEntitiesFromResponse(response)),
        catchError(this.handleError(`Failed to fetch raw material usage for batch ${batchId}`)),
      );
  }

  linkRawMaterial(batchId: string, request: LinkRawMaterialRequest): Observable<RawMaterialUsage> {
    return this.http
      .post<RawMaterialUsageResource>(`${this.endpointUrl}/${batchId}/materials`, request)
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError(`Failed to link raw material to batch ${batchId}`)),
      );
  }
}
