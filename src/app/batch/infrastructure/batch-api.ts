import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';

import { Batch } from '../domain/model/batch.entity';
import { RawMaterialUsage } from '../domain/model/raw-material-usage.entity';

import { BatchApiEndpoint } from './batch-api-endpoint';
import { RawMaterialUsageApiEndpoint } from './raw-material-usage-api-endpoint';

import { CreateBatchRequest, ReleaseBatchRequest, RejectBatchRequest } from './batch.request';
import { LinkRawMaterialRequest } from './raw-material-usage.request';

/**
 * HTTP API client service for Batch and Raw Material Usage operations.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this service acts as an infrastructure
 * facade. It encapsulates all HTTP communication for the Batch aggregate within the
 * manufacturing domain. By extending {@link BaseApi}, it delegates specific operations to
 * {@link BatchApiEndpoint} and {@link RawMaterialUsageApiEndpoint}, providing a
 * unified interface for the application layer to interact with external backend systems.
 *
 * The service handles:
 * - Batch lifecycle management (Retrieval, Creation, Release, Rejection)
 * - Raw material traceability within batches (Usage retrieval, Linking materials)
 *
 * @author Qualitrack
 */
@Injectable({ providedIn: 'root' })
export class BatchApi extends BaseApi {
  /**
   * Dedicated endpoint handler for Batch lifecycle operations.
   */
  private readonly _batchEndpoint: BatchApiEndpoint;

  /**
   * Dedicated endpoint handler for Raw Material Usage traceability.
   */
  private readonly _usageEndpoint: RawMaterialUsageApiEndpoint;

  /**
   * Creates an instance of BatchApi.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the API service by instantiating the specific endpoint handlers
   * required to manage the Batch aggregate and its raw material dependencies.
   */
  constructor(http: HttpClient) {
    super();
    this._batchEndpoint = new BatchApiEndpoint(http);
    this._usageEndpoint = new RawMaterialUsageApiEndpoint(http);
  }

  // ── Batch Management ───────────────────────────────────────────────────

  getBatchById(batchId: number): Observable<Batch> {
    return this._batchEndpoint.getBatchById(batchId);
  }

  /**
   * Retrieves all manufacturing batches associated with a specific laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory
   * @returns An Observable emitting an array of Batch domain entities
   *
   * @remarks
   * Delegates the HTTP GET request to the batch endpoint to fetch the collection
   * and ensures the response is mapped into proper domain entities.
   */
  getBatches(labId: number): Observable<Batch[]> {
    return this._batchEndpoint.getBatchesByLab(labId);
  }

  /**
   * Initiates the creation of a new production batch.
   *
   * @param request - The payload containing the initial manufacturing parameters
   * @returns An Observable emitting the newly created Batch domain entity
   *
   * @remarks
   * Sends an HTTP POST request to register a new batch in the system based on the
   * provided request contract.
   */
  createBatch(request: CreateBatchRequest): Observable<Batch> {
    return this._batchEndpoint.createBatch(request);
  }

  /**
   * Officially approves and releases a production batch.
   *
   * @param batchId - The unique numeric identifier of the batch to be released
   * @param request - The payload containing final quality control remarks and release date
   * @returns An Observable emitting the updated Batch domain entity
   *
   * @remarks
   * Submits the required compliance data to transition the batch state to 'RELEASED'.
   */
  releaseBatch(batchId: number, request: ReleaseBatchRequest): Observable<Batch> {
    return this._batchEndpoint.releaseBatch(batchId, request);
  }

  /**
   * Rejects a production batch due to quality control failures.
   *
   * @param batchId - The unique numeric identifier of the batch to be rejected
   * @param request - The payload containing the rejection justification and date
   * @returns An Observable emitting the updated Batch domain entity
   *
   * @remarks
   * Submits the non-compliance data to transition the batch state to 'REJECTED'
   * in accordance with Good Manufacturing Practices (BPM/GMP).
   */
  rejectBatch(batchId: number, request: RejectBatchRequest): Observable<Batch> {
    return this._batchEndpoint.rejectBatch(batchId, request);
  }

  // ── Raw Material Usage ──────────────────────────────────────────────────

  /**
   * Retrieves all raw material consumption records for a specific batch.
   *
   * @param batchId - The unique numeric identifier of the batch
   * @returns An Observable emitting an array of RawMaterialUsage domain entities
   *
   * @remarks
   * Fetches the full traceability log of materials consumed during the specified
   * production batch run.
   */
  getRawMaterialUsage(batchId: number): Observable<RawMaterialUsage[]> {
    return this._usageEndpoint.getUsageByBatch(batchId);
  }

  /**
   * Allocates and links a raw material to an ongoing production batch.
   *
   * @param batchId - The unique numeric identifier of the batch consuming the material
   * @param request - The payload containing material identifiers and consumption quantities
   * @returns An Observable emitting the newly registered RawMaterialUsage domain entity
   *
   * @remarks
   * Sends an HTTP POST request to record the physical usage of a raw material,
   * establishing a vital genealogical link for quality control tracking.
   */
  linkRawMaterial(batchId: number, request: LinkRawMaterialRequest): Observable<RawMaterialUsage> {
    return this._usageEndpoint.linkRawMaterial(batchId, request);
  }
}
