import { Injectable, signal, computed, inject } from '@angular/core';
import { retry } from 'rxjs';
import { BatchApi } from '../infrastructure/batch-api';
import { Batch } from '../domain/model/batch.entity';
import { RawMaterialUsage } from '../domain/model/raw-material-usage.entity';
import { CreateBatchCommand } from '../domain/model/create-batch.command';
import { ReleaseBatchCommand } from '../domain/model/release-batch.command';
import { RejectBatchCommand } from '../domain/model/reject-batch.command';
import { LinkRawMaterialCommand } from '../domain/model/link-raw-material.command';
import {
  CreateBatchRequest,
  ReleaseBatchRequest,
  RejectBatchRequest,
} from '../infrastructure/batch.request';
import { LinkRawMaterialRequest } from '../infrastructure/raw-material-usage.request';

/**
 * Signal-based application store for the Batch bounded context.
 */
@Injectable({ providedIn: 'root' })
export class BatchStore {
  private readonly api = inject(BatchApi);

  private readonly _batches = signal<Batch[]>([]);
  private readonly _currentBatchUsage = signal<RawMaterialUsage[]>([]);
  private readonly _selectedBatch = signal<Batch | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _successMsg = signal<string | null>(null);

  readonly batches = this._batches.asReadonly();
  readonly currentBatchUsage = this._currentBatchUsage.asReadonly();
  readonly selectedBatch = this._selectedBatch.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly successMsg = this._successMsg.asReadonly();

  readonly pendingBatches = computed(() =>
      this._batches().filter((batch) => batch.status === 'PENDING' || batch.status === 'IN_PROGRESS'),
  );

  readonly finishedBatches = computed(() =>
      this._batches().filter((batch) => batch.status === 'RELEASED' || batch.status === 'REJECTED'),
  );

  loadBatchById(batchId: number): void {
    this.startRequest();

    this.api
        .getBatchById(batchId)
        .pipe(retry(2))
        .subscribe({
          next: (batch) => {
            this._selectedBatch.set(batch);
            this.upsertBatch(batch);
            this.finishRequest();
          },
          error: (error) => this.failRequest(error, 'Failed to load batch detail'),
        });
  }

  loadBatches(labId: number): void {
    this.startRequest();

    this.api
        .getBatches(labId)
        .pipe(retry(2))
        .subscribe({
          next: (batches) => {
            this._batches.set(batches);
            this.finishRequest();
          },
          error: (error) => this.failRequest(error, 'Failed to load batch list'),
        });
  }

  createBatch(command: CreateBatchCommand): void {
    this.startRequest();

    const request = this.toCreateBatchRequest(command);

    this.api
        .createBatch(request)
        .subscribe({
          next: (batch) => {
            this._batches.update((list) => [...list, batch]);
            this._selectedBatch.set(batch);
            this._successMsg.set('Batch created successfully');
            this.finishRequest();
          },
          error: (error) => this.failRequest(error, 'Failed to create batch'),
        });
  }

  releaseBatch(batchId: number, command: ReleaseBatchCommand): void {
    this.startRequest();

    const request = this.toReleaseBatchRequest(command);

    this.api
        .releaseBatch(batchId, request)
        .subscribe({
          next: (updatedBatch) => {
            this.upsertBatch(updatedBatch);
            this._selectedBatch.set(updatedBatch);
            this._successMsg.set('Batch released successfully');
            this.finishRequest();
          },
          error: (error) => this.failRequest(error, 'Failed to release batch'),
        });
  }

  rejectBatch(batchId: number, command: RejectBatchCommand): void {
    this.startRequest();

    const request = this.toRejectBatchRequest(command);

    this.api
        .rejectBatch(batchId, request)
        .subscribe({
          next: (updatedBatch) => {
            this.upsertBatch(updatedBatch);
            this._selectedBatch.set(updatedBatch);
            this._successMsg.set('Batch rejected successfully');
            this.finishRequest();
          },
          error: (error) => this.failRequest(error, 'Failed to reject batch'),
        });
  }

  loadBatchUsage(batchId: number): void {
    this.startRequest();

    this.api
        .getRawMaterialUsage(batchId)
        .pipe(retry(2))
        .subscribe({
          next: (usage) => {
            this._currentBatchUsage.set(usage);
            this.finishRequest();
          },
          error: (error) => this.failRequest(error, 'Failed to load material usage'),
        });
  }

  linkMaterial(batchId: number, command: LinkRawMaterialCommand): void {
    this.startRequest();

    const request = this.toLinkRawMaterialRequest(command);

    this.api
        .linkRawMaterial(batchId, request)
        .subscribe({
          next: (usage) => {
            this._currentBatchUsage.update((list) => [...list, usage]);
            this._successMsg.set('Raw material linked successfully');
            this.finishRequest();
          },
          error: (error) => this.failRequest(error, 'Failed to link raw material'),
        });
  }

  clearMessages(): void {
    this._error.set(null);
    this._successMsg.set(null);
  }

  private toCreateBatchRequest(command: CreateBatchCommand): CreateBatchRequest {
    return {
      labId: command.labId,
      productId: command.productId,
      batchNumber: command.batchNumber,
      quantity: command.quantity,
      unit: command.unit,
      startDate: command.startDate,
      notes: command.notes,
    };
  }

  private toReleaseBatchRequest(command: ReleaseBatchCommand): ReleaseBatchRequest {
    return {
      releaseDate: command.releaseDate,
      notes: command.notes,
    };
  }

  private toRejectBatchRequest(command: RejectBatchCommand): RejectBatchRequest {
    return {
      rejectionDate: command.rejectionDate,
      reason: command.reason,
    };
  }

  private toLinkRawMaterialRequest(command: LinkRawMaterialCommand): LinkRawMaterialRequest {
    return {
      rawMaterialId: command.rawMaterialId,
      quantityUsed: command.quantityUsed,
    };
  }

  private upsertBatch(batch: Batch): void {
    this._batches.update((list) => {
      const exists = list.some((item) => item.id === batch.id);
      return exists ? list.map((item) => (item.id === batch.id ? batch : item)) : [...list, batch];
    });
  }

  private startRequest(): void {
    this._isLoading.set(true);
    this._error.set(null);
    this._successMsg.set(null);
  }

  private finishRequest(): void {
    this._isLoading.set(false);
  }

  private failRequest(error: unknown, fallback: string): void {
    this._error.set(this.formatError(error, fallback));
    this._isLoading.set(false);
  }

  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
          ? `${fallback}: Not Found`
          : error.message;
    }

    return fallback;
  }
}
