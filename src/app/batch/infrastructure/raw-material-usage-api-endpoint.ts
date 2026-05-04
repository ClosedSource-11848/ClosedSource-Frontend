import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { environment } from '../../../environments/environment';
import { RawMaterialUsage } from '../domain/model/raw-material-usage.entity';
import { RawMaterialUsageResource } from './batch-response';
import { RawMaterialUsageAssembler } from './raw-material-usage-assembler';
import { LinkRawMaterialRequest } from './batch.request';

const usageEndpointUrl = `${environment.serverBasePath}${environment.batchRawMaterialUsageEndpointPath}`;

export class RawMaterialUsageApiEndpoint extends BaseApiEndpoint<
  RawMaterialUsage,
  RawMaterialUsageResource,
  BaseResponse,
  RawMaterialUsageAssembler
> {
  constructor(http: HttpClient) {
    super(http, usageEndpointUrl, new RawMaterialUsageAssembler());
  }

  /**
   * Obtiene todos los materiales utilizados en un lote específico.
   */
  getUsageByBatch(batchId: string): Observable<RawMaterialUsage[]> {
    return this.http
      .get<RawMaterialUsageResource[]>(`${this.endpointUrl}/${batchId}/materials`)
      .pipe(
        map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
        catchError(this.handleError(`Failed to fetch raw material usage for batch ${batchId}`)),
      );
  }

  /**
   * Registra el uso de una materia prima en un lote.
   */
  linkRawMaterial(batchId: string, request: LinkRawMaterialRequest): Observable<RawMaterialUsage> {
    return this.http
      .post<RawMaterialUsageResource>(`${this.endpointUrl}/${batchId}/materials`, request)
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError(`Failed to link raw material to batch ${batchId}`)),
      );
  }
}
