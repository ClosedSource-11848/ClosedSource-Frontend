import { Injectable, signal, computed, inject } from '@angular/core';
import { retry } from 'rxjs';
import { BatchApi } from '../infrastructure/batch-api';
import { Batch } from '../domain/model/batch.entity';
import { RawMaterialUsage } from '../domain/model/raw-material-usage.entity';
import { CreateBatchCommand } from '../domain/model/create-batch.command';
import { ReleaseBatchCommand } from '../domain/model/release-batch.command';
import { RejectBatchCommand } from '../domain/model/reject-batch.command';
import { LinkRawMaterialCommand } from '../domain/model/link-raw-material.command';

/**
 * Global state management for the Batch manufacturing domain using Angular Signals.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this store acts as an application service
 * that orchestrates the flow of data between the presentation layer and the
 * infrastructure layer ({@link BatchApi}). It maintains the reactive state of batches
 * and material usage, ensuring the UI stays synchronized with domain changes.
 *
 * It manages:
 * - Reactive lists of production batches and raw material consumption.
 * - Loading, error, and success states for user feedback.
 * - Complex domain filtering via computed signals.
 *
 * @author Qualitrack
 */
@Injectable({ providedIn: 'root' })
export class BatchStore {
  /**
   * Infrastructure service for HTTP communication.
   */
  private readonly api = inject(BatchApi);

  // ── State (Private Signals) ────────────────────────────────────────────────

  /**
   * Internal list of all fetched batches.
   */
  private readonly _batches = signal<Batch[]>([]);

  /**
   * Internal list of material usage records for the currently selected batch.
   */
  private readonly _currentBatchUsage = signal<RawMaterialUsage[]>([]);

  /**
   * Flag indicating if an asynchronous operation is in progress.
   */
  private readonly _isLoading = signal<boolean>(false);

  /**
   * Stores current error messages for the UI.
   */
  private readonly _error = signal<string | null>(null);

  /**
   * Stores temporary success feedback messages.
   */
  private readonly _successMsg = signal<string | null>(null);

  private readonly _selectedBatch = signal<Batch | null>(null);

  // ── Selectors (Readonly Public Signals) ─────────────────────────────────────

  /** Exposed readonly signal of the batches list. */
  readonly batches = this._batches.asReadonly();

  /** Exposed readonly signal of current material usage records. */
  readonly currentBatchUsage = this._currentBatchUsage.asReadonly();

  /** Exposed readonly signal for loading state. */
  readonly isLoading = this._isLoading.asReadonly();

  /** Exposed readonly signal for error feedback. */
  readonly error = this._error.asReadonly();

  /** Exposed readonly signal for success feedback. */
  readonly successMsg = this._successMsg.asReadonly();

  /**
   * Computed selector for batches that are active in the production cycle.
   * Filters by statuses 'PENDING' and 'IN_PROGRESS'.
   */
  readonly pendingBatches = computed(() =>
    this._batches().filter((b) => b.status === 'PENDING' || b.status === 'IN_PROGRESS'),
  );

  /**
   * Computed selector for batches that have finished their lifecycle.
   * Filters by statuses 'RELEASED' and 'REJECTED'.
   */
  readonly finishedBatches = computed(() =>
    this._batches().filter((b) => b.status === 'RELEASED' || b.status === 'REJECTED'),
  );

  readonly selectedBatch = this._selectedBatch.asReadonly();

  // ── Batch Management ─────────────────────────────────────────────────────

  loadBatchById(batchId: number): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.api
      .getBatchById(batchId)
      .pipe(retry(2))
      .subscribe({
        next: (batch: Batch) => {
          this._selectedBatch.set(batch);

          this._batches.update((list) => {
            const exists = list.some((item) => item.id === batch.id);
            return exists
              ? list.map((item) => (item.id === batch.id ? batch : item))
              : [...list, batch];
          });

          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load batch detail'));
          this._isLoading.set(false);
        },
      });
  }

  /**
   * Fetches the list of batches from the API for a specific laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory.
   */
  loadBatches(labId: number): void {
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

  /**
   * Triggers the creation of a new batch using an application command.
   *
   * @param command - The domain intent and data for the new batch.
   */
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

  /**
   * Finalizes and releases a batch into the distribution phase.
   *
   * @param batchId - Numeric identifier of the batch to update.
   * @param command - The release details and quality remarks.
   */
  releaseBatch(batchId: number, command: ReleaseBatchCommand): void {
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

  /**
   * Marks a batch as rejected due to non-compliance.
   *
   * @param batchId - Numeric identifier of the batch to update.
   * @param command - The rejection justification and date.
   */
  rejectBatch(batchId: number, command: RejectBatchCommand): void {
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

  /**
   * Loads the genealogy of raw materials used in a specific batch.
   *
   * @param batchId - The target numeric batch identifier.
   */
  loadBatchUsage(batchId: number): void {
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

  /**
   * Links a specific amount of raw material to the batch record.
   *
   * @param batchId - The numeric identifier of the consuming batch.
   * @param command - The material ID and quantity used.
   */
  linkMaterial(batchId: number, command: LinkRawMaterialCommand): void {
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

  /**
   * Resets the error and success messages in the state.
   */
  clearMessages(): void {
    this._error.set(null);
    this._successMsg.set(null);
  }

  /**
   * Internal helper to normalize domain and infrastructure errors.
   *
   * @param error - The raw error object.
   * @param fallback - Default message if parsing fails.
   * @returns A user-friendly error string.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not Found`
        : error.message;
    }
    return fallback;
  }
}
