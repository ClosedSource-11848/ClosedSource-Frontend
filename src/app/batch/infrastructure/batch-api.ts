import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { BatchApiEndpoint } from './batch-api-endpoint';
import { RawMaterialUsageApiEndpoint } from './raw-material-usage-api-endpoint';
import { Batch } from '../domain/model/batch.entity';
import { RawMaterialUsage } from '../domain/model/raw-material-usage.entity';
import {
  CreateBatchRequest,
  ReleaseBatchRequest,
  RejectBatchRequest,
  LinkRawMaterialRequest,
} from './batch.request';

@Injectable({ providedIn: 'root' })
export class BatchApi extends BaseApi {
  private readonly _batchEndpoint: BatchApiEndpoint;
  private readonly _usageEndpoint: RawMaterialUsageApiEndpoint;

  constructor(http: HttpClient) {
    super();
    // Inicialización de endpoints siguiendo el patrón modular
    this._batchEndpoint = new BatchApiEndpoint(http);
    this._usageEndpoint = new RawMaterialUsageApiEndpoint(http);
  }

  // ── Batch Management ───────────────────────────────────────────────────

  /**
   * Recupera todos los lotes asociados a un laboratorio específico.
   */
  getBatches(labId: string): Observable<Batch[]> {
    return this._batchEndpoint.getBatchesByLab(labId);
  }

  /**
   * Crea un nuevo lote de producción.
   */
  createBatch(request: CreateBatchRequest): Observable<Batch> {
    return this._batchEndpoint.createBatch(request);
  }

  /**
   * Libera un lote tras la aprobación de calidad (BPM).
   */
  releaseBatch(batchId: string, request: ReleaseBatchRequest): Observable<Batch> {
    return this._batchEndpoint.releaseBatch(batchId, request);
  }

  /**
   * Rechaza un lote por incumplimiento de parámetros de calidad.
   */
  rejectBatch(batchId: string, request: RejectBatchRequest): Observable<Batch> {
    // Se asume la existencia del método en el endpoint similar a releaseBatch
    return this._batchEndpoint.rejectBatch(batchId, request);
  }

  // ── Raw Material Usage ──────────────────────────────────────────────────

  /**
   * Obtiene el historial de materias primas vinculadas a un lote.
   */
  getRawMaterialUsage(batchId: string): Observable<RawMaterialUsage[]> {
    return this._usageEndpoint.getUsageByBatch(batchId);
  }

  /**
   * Registra el consumo de una materia prima para un lote específico.
   */
  linkRawMaterial(batchId: string, request: LinkRawMaterialRequest): Observable<RawMaterialUsage> {
    return this._usageEndpoint.linkRawMaterial(batchId, request);
  }
}
