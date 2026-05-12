/**
 * Represents the incoming payload required to register a new production batch.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this interface acts as a strict data contract
 * for the external presentation or infrastructure layer (e.g., an HTTP API request body).
 * It captures the raw input data from the client before it is validated and mapped
 * into a robust application Command (like `CreateBatchCommand`).
 *
 * @example
 * ```typescript
 * const requestPayload: CreateBatchRequest = {
 *   labId: 'lab-001',
 *   productId: 'prod-890',
 *   batchNumber: 'LOTE-2026A',
 *   quantity: 5000,
 *   startDate: '2026-05-12T08:00:00Z',
 *   notes: 'Standard production run'
 * };
 *
 ```
 *
 * @author Qualitrack
 */
export interface CreateBatchRequest {
  /**
   * The identifier of the laboratory where the batch will be produced.
   */
  labId: string;

  /**
   * The identifier of the product that is going to be manufactured.
   */
  productId: string;

  /**
   * The specific alphanumeric traceability code to be assigned to this batch run.
   */
  batchNumber: string;

  /**
   * The intended total volume or amount to be produced in this batch.
   */
  quantity: number;

  /**
   * The ISO date string representing when the batch processing is scheduled to begin.
   */
  startDate: string;

  /**
   * Optional domain-specific remarks or instructions provided by the client.
   */
  notes?: string;
}

/**
 * Represents the incoming payload required to officially release a production batch.
 *
 * @remarks
 * This interface defines the external data contract for client requests aiming to approve
 * a batch after quality control. Typically used in the presentation layer (e.g., an API route),
 * it captures the release details before being transformed into an application-level Command.
 * The target batch identifier is usually provided via route parameters rather than this payload.
 *
 * @example
 * ```typescript
 * const releasePayload: ReleaseBatchRequest = {
 *   releaseDate: '2026-05-12T11:30:00Z',
 *   notes: 'All final quality control tests passed successfully.'
 * };
 *
 ```
 *
 * @author Qualitrack
 */
export interface ReleaseBatchRequest {
  /**
   * The ISO date string representing the exact moment the batch was officially approved.
   */
  releaseDate: string;

  /**
   * Final quality control observations or compliance remarks justifying the approval for release.
   */
  notes: string;
}

/**
 * Represents the incoming payload required to reject a production batch.
 *
 * @remarks
 * This interface defines the external data contract for client requests aiming to reject
 * a batch due to quality control failures or Good Manufacturing Practices (BPM) non-compliance.
 * Used at the presentation boundary, it captures the mandatory justification data before
 * mapping to an application Command.
 *
 * @example
 * ```typescript
 * const rejectPayload: RejectBatchRequest = {
 *   rejectionDate: '2026-05-12T10:00:00Z',
 *   reason: 'Failed viscosity and pH tests during final validation phase.'
 * };
 *
 ```
 *
 * @author Qualitrack
 */
export interface RejectBatchRequest {
  /**
   * The ISO date string representing the exact moment the rejection was formalized.
   */
  rejectionDate: string;

  /**
   * The specific justification for the rejection, aligned with quality control standards and BPM.
   */
  reason: string;
}
