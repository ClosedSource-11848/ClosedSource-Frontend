import { Injectable, signal, computed, inject } from '@angular/core';
import { retry } from 'rxjs';
import { BatchApi } from '../infrastructure/batch-api';
import { Batch } from '../domain/model/batch.entity';
import { RawMaterialUsage } from '../domain/model/raw-material-usage.entity';
import { CreateBatchCommand } from '../domain/model/create-batch.command';
import { ReleaseBatchCommand } from '../domain/model/release-batch.command';
import { RejectBatchCommand } from '../domain/model/reject-batch.command';
import { LinkRawMaterialCommand } from '../domain/model/link-raw-material.command';

@Injectable({ providedIn: 'root' })
export class BatchStore {
  private readonly api = inject(BatchApi);

  // ── State ────────────────────────────────────────────────────────────────
  private readonly _batches = signal<Batch[]>([]);
  private readonly _currentBatchUsage = signal<RawMaterialUsage[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _successMsg = signal<string | null>(null);

  // ── Selectors (readonly) ─────────────────────────────────────────────────
  readonly batches = this._batches.asReadonly();
  readonly currentBatchUsage = this._currentBatchUsage.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly successMsg = this._successMsg.asReadonly();

  // Selectores Computados
  readonly pendingBatches = computed(() =>
    this._batches().filter((b) => b.status === 'PENDING' || b.status === 'IN_PROGRESS'),
  );
  readonly finishedBatches = computed(() =>
    this._batches().filter((b) => b.status === 'RELEASED' || b.status === 'REJECTED'),
  );

  // ── Batch Management ─────────────────────────────────────────────────────

  loadBatches(labId: string): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .getBatches(labId)
      .pipe(retry(2))
      .subscribe({
        next: (batches: Batch[]) => {
          this._batches.set(batches);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load batch list'));
          this._isLoading.set(false);
        },
      });
  }

  createBatch(command: CreateBatchCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .createBatch(command as any)
      .pipe(retry(2))
      .subscribe({
        next: (batch: Batch) => {
          this._batches.update((list) => [...list, batch]);
          this._successMsg.set('Batch created successfully');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to create batch'));
          this._isLoading.set(false);
        },
      });
  }

  releaseBatch(batchId: string, command: ReleaseBatchCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .releaseBatch(batchId, command as any)
      .pipe(retry(2))
      .subscribe({
        next: (updatedBatch: Batch) => {
          this._batches.update((list) => list.map((b) => (b.id === batchId ? updatedBatch : b)));
          this._successMsg.set('Batch released successfully');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to release batch'));
          this._isLoading.set(false);
        },
      });
  }

  rejectBatch(batchId: string, command: RejectBatchCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .rejectBatch(batchId, command as any)
      .pipe(retry(2))
      .subscribe({
        next: (updatedBatch: Batch) => {
          this._batches.update((list) => list.map((b) => (b.id === batchId ? updatedBatch : b)));
          this._successMsg.set('Batch rejected successfully');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to reject batch'));
          this._isLoading.set(false);
        },
      });
  }

  // ── Raw Material Usage ───────────────────────────────────────────────────

  loadBatchUsage(batchId: string): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .getRawMaterialUsage(batchId)
      .pipe(retry(2))
      .subscribe({
        next: (usage: RawMaterialUsage[]) => {
          this._currentBatchUsage.set(usage);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load material usage'));
          this._isLoading.set(false);
        },
      });
  }

  linkMaterial(batchId: string, command: LinkRawMaterialCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .linkRawMaterial(batchId, command as any)
      .pipe(retry(2))
      .subscribe({
        next: (usage: RawMaterialUsage) => {
          this._currentBatchUsage.update((list) => [...list, usage]);
          this._successMsg.set('Raw material linked successfully');
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to link raw material'));
          this._isLoading.set(false);
        },
      });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  clearMessages(): void {
    this._error.set(null);
    this._successMsg.set(null);
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not Found`
        : error.message;
    }
    return fallback;
  }
}
