import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Batch } from '../domain/model/batch.entity';
import { BatchResource, BatchesResponse } from './batch-response';
import { BatchAssembler } from './batch-assembler';
import { CreateBatchRequest, ReleaseBatchRequest, RejectBatchRequest } from './batch.request';

const batchEndpointUrl = `${environment.serverBasePath}${environment.batchEndpointPath}`;

export class BatchApiEndpoint extends BaseApiEndpoint<
  Batch,
  BatchResource,
  BatchesResponse,
  BatchAssembler
> {
  constructor(http: HttpClient) {
    super(http, batchEndpointUrl, new BatchAssembler());
  }

  getBatchesByLab(labId: string): Observable<Batch[]> {
    return this.http.get<BatchesResponse>(`${this.endpointUrl}/lab/${labId}`).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response)),
      catchError(this.handleError(`Failed to fetch batches for lab ${labId}`)),
    );
  }

  createBatch(request: CreateBatchRequest): Observable<Batch> {
    return this.http.post<BatchResource>(this.endpointUrl, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to create batch')),
    );
  }

  releaseBatch(batchId: string, request: ReleaseBatchRequest): Observable<Batch> {
    return this.http.patch<BatchResource>(`${this.endpointUrl}/${batchId}/release`, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to release batch ${batchId}`)),
    );
  }

  rejectBatch(batchId: string, request: RejectBatchRequest): Observable<Batch> {
    return this.http.patch<BatchResource>(`${this.endpointUrl}/${batchId}/reject`, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to reject batch ${batchId}`)),
    );
  }
}
