import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents the consumption record of a raw material during a manufacturing batch.
 *
 * @remarks
 * In Domain-Driven Design, `RawMaterialUsage` is an entity that provides critical traceability
 * between the production process (Batch) and the inventory (Raw Material). It tracks
 * exactly how much of a specific material was consumed, when it was used, and for which batch.
 * This ensures strict quality control and accurate genealogical tracking of the final product.
 *
 * @example
 * ```typescript
 * const usageRecord = new RawMaterialUsage({
 *   id: 'usage-789a-4b2c',
 *   batchId: '123e4567-e89b-12d3-a456-426614174000',
 *   rawMaterialId: 'mat-045',
 *   rawMaterialName: 'Purified Water',
 *   quantityUsed: 150.5,
 *   unit: 'liters',
 *   usageDate: '2026-05-12T09:30:00Z',
 *   createdAt: '2026-05-12T09:35:00Z'
 * });
 *
 * console.log(`Consumed ${usageRecord.quantityUsed} ${usageRecord.unit} of ${usageRecord.rawMaterialName}`);
 * ```
 *
 * @author Qualitrack
 */
export class RawMaterialUsage implements BaseEntity {
  /**
   * The unique identifier for this material usage record.
   */
  id: string;

  /**
   * The identifier of the production batch that consumed the material.
   */
  batchId: string;

  /**
   * The identifier of the specific raw material being consumed.
   */
  rawMaterialId: string;

  /**
   * The display name of the raw material.
   */
  rawMaterialName: string;

  /**
   * The exact amount of the raw material that was consumed or allocated.
   */
  quantityUsed: number;

  /**
   * The unit of measurement for the consumed quantity (e.g., 'kg', 'liters', 'g').
   */
  unit: string;

  /**
   * The ISO date string representing when the material was physically added or utilized in the batch.
   */
  usageDate: string;

  /**
   * The ISO date string representing the exact moment this entity record was registered in the system.
   */
  createdAt: string;

  /**
   * Creates a new RawMaterialUsage entity.
   *
   * @param params - Initialization properties
   * @param params.id - The unique identifier for the usage record
   * @param params.batchId - The target batch identifier
   * @param params.rawMaterialId - The consumed raw material identifier
   * @param params.rawMaterialName - The name of the raw material
   * @param params.quantityUsed - The amount consumed
   * @param params.unit - The unit of measurement
   * @param params.usageDate - The date and time of actual physical usage
   * @param params.createdAt - The creation timestamp of the record
   *
   * @remarks
   * Constructor initializes the usage record with the provided domain values.
   * It requires full traceability data linking the batch and the material to be instantiated.
   */
  constructor(params: {
    id: string;
    batchId: string;
    rawMaterialId: string;
    rawMaterialName: string;
    quantityUsed: number;
    unit: string;
    usageDate: string;
    createdAt: string;
  }) {
    this.id = params.id;
    this.batchId = params.batchId;
    this.rawMaterialId = params.rawMaterialId;
    this.rawMaterialName = params.rawMaterialName;
    this.quantityUsed = params.quantityUsed;
    this.unit = params.unit;
    this.usageDate = params.usageDate;
    this.createdAt = params.createdAt;
  }
}
