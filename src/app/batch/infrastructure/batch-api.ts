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

@Injectable({ providedIn: 'root' })
export class BatchApi extends BaseApi {
  private readonly _batchEndpoint: BatchApiEndpoint;
  private readonly _usageEndpoint: RawMaterialUsageApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this._batchEndpoint = new BatchApiEndpoint(http);
    this._usageEndpoint = new RawMaterialUsageApiEndpoint(http);
  }

  // ── Batch Management ───────────────────────────────────────────────────
  getBatches(labId: string): Observable<Batch[]> {
    return this._batchEndpoint.getBatchesByLab(labId);
  }

  createBatch(request: CreateBatchRequest): Observable<Batch> {
    return this._batchEndpoint.createBatch(request);
  }

  releaseBatch(batchId: string, request: ReleaseBatchRequest): Observable<Batch> {
    return this._batchEndpoint.releaseBatch(batchId, request);
  }

  rejectBatch(batchId: string, request: RejectBatchRequest): Observable<Batch> {
    return this._batchEndpoint.rejectBatch(batchId, request);
  }

  // ── Raw Material Usage ──────────────────────────────────────────────────
  getRawMaterialUsage(batchId: string): Observable<RawMaterialUsage[]> {
    return this._usageEndpoint.getUsageByBatch(batchId);
  }

  linkRawMaterial(batchId: string, request: LinkRawMaterialRequest): Observable<RawMaterialUsage> {
    return this._usageEndpoint.linkRawMaterial(batchId, request);
  }
}
