import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Batch } from '../domain/model/batch.entity';
import { BatchResource, BatchesResponse } from './batch-response';
import { BatchAssembler } from './batch-assembler';
import { CreateBatchRequest, ReleaseBatchRequest, RejectBatchRequest } from './batch.request';

const batchEndpointUrl = `${environment.serverBasePath}${environment.batchEndpointPath}`;

/**
 * HTTP endpoint client for batch manufacturing operations.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this endpoint encapsulates all HTTP
 * communication for the Batch aggregate within the manufacturing bounded context.
 * It extends {@link BaseApiEndpoint} to inherit core HTTP handling capabilities
 * while implementing batch-specific operational routes.
 *
 * The endpoint handles:
 * - GET /batches/lab/:labId - Retrieve all batches for a specific laboratory
 * - POST /batches - Register a new production batch
 * - PATCH /batches/:id/release - Officially release a batch
 * - PATCH /batches/:id/reject - Reject a batch due to quality control failures
 *
 * Resource conversion is delegated to {@link BatchAssembler}, ensuring that
 * the application layer only interacts with pure Domain Entities, completely
 * isolating it from infrastructure-specific resource shapes.
 *
 * @author Qualitrack
 */
export class BatchApiEndpoint extends BaseApiEndpoint<
  Batch,
  BatchResource,
  BatchesResponse,
  BatchAssembler
> {
  /**
   * Creates an instance of BatchApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the endpoint with the configured server base URL and the
   * batch endpoint path. The {@link BatchAssembler} is instantiated to convert
   * between Batch domain entities and BatchResource infrastructure objects.
   */
  constructor(http: HttpClient) {
    super(http, batchEndpointUrl, new BatchAssembler());
  }

  /**
   * Retrieves all production batches associated with a specific laboratory.
   *
   * @param labId - The unique identifier of the target laboratory
   * @returns An Observable emitting an array of Batch domain entities
   *
   * @remarks
   * Makes an HTTP GET request to fetch the collection of batch resources.
   * It pipes the response envelope through the assembler to transform the raw
   * infrastructure payload into an array of pure Batch domain entities.
   */
  getBatchesByLab(labId: string): Observable<Batch[]> {
    return this.http.get<BatchesResponse>(`${this.endpointUrl}/lab/${labId}`).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response)),
      catchError(this.handleError(`Failed to fetch batches for lab ${labId}`)),
    );
  }

  /**
   * Registers a new production batch in the external system.
   *
   * @param request - The payload containing the initial manufacturing parameters
   * @returns An Observable emitting the newly created Batch domain entity
   *
   * @remarks
   * Makes an HTTP POST request to create a batch resource based on the incoming contract.
   * The resulting infrastructure resource is then mapped back into a domain entity
   * for application use.
   */
  createBatch(request: CreateBatchRequest): Observable<Batch> {
    return this.http.post<BatchResource>(this.endpointUrl, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to create batch')),
    );
  }

  /**
   * Officially approves and releases a production batch via the API.
   *
   * @param batchId - The unique identifier of the batch to be released
   * @param request - The payload containing release date and quality control remarks
   * @returns An Observable emitting the updated Batch domain entity
   *
   * @remarks
   * Makes an HTTP PATCH request to transition the batch state to 'RELEASED'.
   * Translates the returned infrastructure resource back into a domain entity,
   * reflecting the new state within the application.
   */
  releaseBatch(batchId: string, request: ReleaseBatchRequest): Observable<Batch> {
    return this.http.patch<BatchResource>(`${this.endpointUrl}/${batchId}/release`, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to release batch ${batchId}`)),
    );
  }

  /**
   * Rejects a production batch via the API due to non-compliance.
   *
   * @param batchId - The unique identifier of the batch to be rejected
   * @param request - The payload containing the rejection date and justification
   * @returns An Observable emitting the updated Batch domain entity
   *
   * @remarks
   * Makes an HTTP PATCH request to transition the batch state to 'REJECTED'.
   * Translates the returned infrastructure resource back into a domain entity,
   * reflecting the recorded non-compliance state within the application.
   */
  rejectBatch(batchId: string, request: RejectBatchRequest): Observable<Batch> {
    return this.http.patch<BatchResource>(`${this.endpointUrl}/${batchId}/reject`, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to reject batch ${batchId}`)),
    );
  }
}
