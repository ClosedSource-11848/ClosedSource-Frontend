/**
 * Represents the intention to register a new production batch within the system.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this Command acts as an application layer
 * structure. It encapsulates all the necessary input parameters required by the Use Case
 * to instantiate a new Batch entity, serving as a strict boundary contract between the
 * external presentation layer and the inner domain model.
 *
 * @example
 * ```typescript
 * const command: CreateBatchCommand = {
 *   labId: 'lab-001',
 *   productId: 'prod-890',
 *   batchNumber: 'LOTE-2026A',
 *   quantity: 5000,
 *   startDate: '2026-05-12T08:00:00Z',
 *   notes: 'Urgent production requested by central distribution.'
 * };
 *
 * await createBatchUseCase.execute(command);
 *
 ```
 *
 * @author Qualitrack
 */
export interface CreateBatchCommand {
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
   * Optional domain-specific remarks or instructions prior to batch creation.
   */
  notes?: string;
}
