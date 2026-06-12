/**
 * Represents the incoming payload required to register a new production batch.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this interface acts as an
 * infrastructure-level request contract for the HTTP API. It captures the data
 * sent to the backend when creating a production batch.
 *
 * This request mirrors the creation command used by the application layer, while
 * remaining a plain DTO suitable for API communication.
 *
 * @example
 * ```typescript
 * const requestPayload: CreateBatchRequest = {
 *   labId: 101,
 *   productId: 890,
 *   batchNumber: 'LOT-2026-001',
 *   quantity: 5000,
 *   unit: 'units',
 *   startDate: '2026-05-12T08:00:00Z',
 *   notes: 'Standard production run'
 * };
 * ```
 */
export interface CreateBatchRequest {
  /**
   * The numeric identifier of the laboratory where the batch will be produced.
   */
  labId: number;

  /**
   * The numeric identifier of the product that is going to be manufactured.
   */
  productId: number;

  /**
   * The specific alphanumeric traceability code assigned to this batch run.
   */
  batchNumber: string;

  /**
   * The intended total volume or amount to be produced in this batch.
   */
  quantity: number;

  /**
   * The unit of measurement for the batch quantity.
   */
  unit: string;

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
 * This interface defines the external data contract for client requests aiming
 * to approve a batch after quality control. The target batch identifier is
 * usually provided through the route parameter.
 *
 * @example
 * ```typescript
 * const releasePayload: ReleaseBatchRequest = {
 *   releaseDate: '2026-05-12T11:30:00Z',
 *   notes: 'All final quality control tests passed successfully.'
 * };
 * ```
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
 * This interface defines the external data contract for client requests aiming
 * to reject a batch due to quality control failures or Good Manufacturing
 * Practices (BPM) non-compliance.
 *
 * @example
 * ```typescript
 * const rejectPayload: RejectBatchRequest = {
 *   rejectionDate: '2026-05-12T10:00:00Z',
 *   reason: 'Failed viscosity and pH tests during final validation phase.'
 * };
 * ```
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
