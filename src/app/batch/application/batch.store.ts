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
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this store belongs to the
 * application layer. It receives commands from the presentation layer, maps
 * them into infrastructure request DTOs, delegates persistence and retrieval
 * operations to {@link BatchApi}, and exposes reactive state to the UI.
 *
 * This store manages:
 * - Batch collection state
 * - Selected batch detail state
 * - Raw material usage traceability for a batch
 * - Loading, error, and success feedback state
 */
@Injectable({ providedIn: 'root' })
export class BatchStore {
  /**
   * Infrastructure facade used to communicate with the backend API.
   */
  private readonly api = inject(BatchApi);

  /**
   * Internal list of loaded production batches.
   */
  private readonly _batches = signal<Batch[]>([]);

  /**
   * Internal list of raw material usage records for the current batch.
   */
  private readonly _currentBatchUsage = signal<RawMaterialUsage[]>([]);

  /**
   * Internal selected batch detail state.
   */
  private readonly _selectedBatch = signal<Batch | null>(null);

  /**
   * Indicates whether an asynchronous operation is currently in progress.
   */
  private readonly _isLoading = signal<boolean>(false);

  /**
   * Stores the latest error message exposed to the UI.
   */
  private readonly _error = signal<string | null>(null);

  /**
   * Stores the latest success message exposed to the UI.
   */
  private readonly _successMsg = signal<string | null>(null);

  /**
   * Readonly signal containing the loaded batch collection.
   */
  readonly batches = this._batches.asReadonly();

  /**
   * Readonly signal containing raw material usage records for the selected batch.
   */
  readonly currentBatchUsage = this._currentBatchUsage.asReadonly();

  /**
   * Readonly signal containing the selected batch detail.
   */
  readonly selectedBatch = this._selectedBatch.asReadonly();

  /**
   * Readonly signal indicating whether the store is loading data.
   */
  readonly isLoading = this._isLoading.asReadonly();

  /**
   * Readonly signal containing the current error message, if any.
   */
  readonly error = this._error.asReadonly();

  /**
   * Readonly signal containing the current success message, if any.
   */
  readonly successMsg = this._successMsg.asReadonly();

  /**
   * Computed selector for batches that are still active in production.
   */
  readonly pendingBatches = computed(() =>
    this._batches().filter((batch) => batch.status === 'PENDING' || batch.status === 'IN_PROGRESS'),
  );

  /**
   * Computed selector for batches that have already finished their lifecycle.
   */
  readonly finishedBatches = computed(() =>
    this._batches().filter((batch) => batch.status === 'RELEASED' || batch.status === 'REJECTED'),
  );

  /**
   * Loads a single batch by its numeric identifier.
   *
   * @param batchId - The unique numeric identifier of the batch
   */
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

  /**
   * Loads all batches associated with a laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory
   */
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

  /**
   * Creates a new production batch from an application command.
   *
   * @param command - Command containing batch creation data
   */
  createBatch(command: CreateBatchCommand): void {
    this.startRequest();

    const request = this.toCreateBatchRequest(command);

    this.api
      .createBatch(request)
      .pipe(retry(2))
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

  /**
   * Releases an existing production batch.
   *
   * @param batchId - The unique numeric identifier of the batch
   * @param command - Command containing release data
   */
  releaseBatch(batchId: number, command: ReleaseBatchCommand): void {
    this.startRequest();

    const request = this.toReleaseBatchRequest(command);

    this.api
      .releaseBatch(batchId, request)
      .pipe(retry(2))
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

  /**
   * Rejects an existing production batch.
   *
   * @param batchId - The unique numeric identifier of the batch
   * @param command - Command containing rejection data
   */
  rejectBatch(batchId: number, command: RejectBatchCommand): void {
    this.startRequest();

    const request = this.toRejectBatchRequest(command);

    this.api
      .rejectBatch(batchId, request)
      .pipe(retry(2))
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

  /**
   * Loads the raw material usage records for a batch.
   *
   * @param batchId - The unique numeric identifier of the batch
   */
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

  /**
   * Links a raw material consumption record to a batch.
   *
   * @param batchId - The unique numeric identifier of the batch
   * @param command - Command containing raw material and quantity data
   */
  linkMaterial(batchId: number, command: LinkRawMaterialCommand): void {
    this.startRequest();

    const request = this.toLinkRawMaterialRequest(command);

    this.api
      .linkRawMaterial(batchId, request)
      .pipe(retry(2))
      .subscribe({
        next: (usage) => {
          this._currentBatchUsage.update((list) => [...list, usage]);
          this._successMsg.set('Raw material linked successfully');
          this.finishRequest();
        },
        error: (error) => this.failRequest(error, 'Failed to link raw material'),
      });
  }

  /**
   * Clears current feedback messages.
   */
  clearMessages(): void {
    this._error.set(null);
    this._successMsg.set(null);
  }

  /**
   * Maps a CreateBatchCommand into the HTTP request payload expected by the API.
   *
   * @param command - Application command to map
   * @returns Infrastructure request DTO
   */
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

  /**
   * Maps a ReleaseBatchCommand into the HTTP request payload expected by the API.
   *
   * @param command - Application command to map
   * @returns Infrastructure request DTO
   */
  private toReleaseBatchRequest(command: ReleaseBatchCommand): ReleaseBatchRequest {
    return {
      releaseDate: command.releaseDate,
      notes: command.notes,
    };
  }

  /**
   * Maps a RejectBatchCommand into the HTTP request payload expected by the API.
   *
   * @param command - Application command to map
   * @returns Infrastructure request DTO
   */
  private toRejectBatchRequest(command: RejectBatchCommand): RejectBatchRequest {
    return {
      rejectionDate: command.rejectionDate,
      reason: command.reason,
    };
  }

  /**
   * Maps a LinkRawMaterialCommand into the HTTP request payload expected by the API.
   *
   * @param command - Application command to map
   * @returns Infrastructure request DTO
   */
  private toLinkRawMaterialRequest(command: LinkRawMaterialCommand): LinkRawMaterialRequest {
    return {
      rawMaterialId: command.rawMaterialId,
      quantityUsed: command.quantityUsed,
    };
  }

  /**
   * Inserts or updates a batch in the local collection.
   *
   * @param batch - Batch entity to insert or replace
   */
  private upsertBatch(batch: Batch): void {
    this._batches.update((list) => {
      const exists = list.some((item) => item.id === batch.id);
      return exists ? list.map((item) => (item.id === batch.id ? batch : item)) : [...list, batch];
    });
  }

  /**
   * Sets loading state and clears previous feedback messages.
   */
  private startRequest(): void {
    this._isLoading.set(true);
    this._error.set(null);
    this._successMsg.set(null);
  }

  /**
   * Clears loading state after a successful request.
   */
  private finishRequest(): void {
    this._isLoading.set(false);
  }

  /**
   * Stores a normalized error message and clears loading state.
   *
   * @param error - Raw error object
   * @param fallback - Fallback message used when the error cannot be parsed
   */
  private failRequest(error: unknown, fallback: string): void {
    this._error.set(this.formatError(error, fallback));
    this._isLoading.set(false);
  }

  /**
   * Normalizes infrastructure and runtime errors into UI-friendly messages.
   *
   * @param error - Raw error object
   * @param fallback - Fallback message used when parsing fails
   * @returns Human-readable error message
   */
  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not Found`
        : error.message;
    }

    return fallback;
  }
}
