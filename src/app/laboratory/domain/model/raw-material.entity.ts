import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a raw material entity within the Laboratory domain.
 *
 * @remarks
 * In Domain-Driven Design, a RawMaterial is an entity that models a physical
 * input substance used in the manufacturing or quality control processes of a
 * laboratory. Each raw material has a unique identity and is always associated
 * with the laboratory that manages it.
 *
 * This entity tracks both the identity and the inventory state of a raw material,
 * including its current stock level, expiration date, and the minimum threshold
 * required to trigger restocking alerts or purchasing workflows.
 *
 * @example
 * ```typescript
 * const material = new RawMaterial({
 *   id: 'mat-001',
 *   labId: 'lab-123',
 *   name: 'Etanol 96°',
 *   code: 'RM-ETH-96',
 *   supplier: 'QuimicaPeru S.A.C.',
 *   batchNumber: 'LOTE-2024-045',
 *   expirationDate: '2026-12-31',
 *   quantityInStock: 150,
 *   unit: 'L',
 *   minimumStock: 20,
 *   createdAt: '2024-04-10T07:30:00Z',
 * });
 *
 * console.log(material.name);            // 'Etanol 96°'
 * console.log(material.quantityInStock); // 150
 * ```
 */
export class RawMaterial implements BaseEntity {
  /**
   * The unique identifier for this raw material record.
   */
  id: string;

  /**
   * The identifier of the laboratory that owns and manages this raw material.
   *
   * @remarks
   * This field establishes the relationship between the raw material and its
   * parent {@link Laboratory} entity, scoping the material's inventory to a
   * specific laboratory context.
   */
  labId: string;

  /**
   * The common or chemical name of the raw material.
   */
  name: string;

  /**
   * The internal catalog code that uniquely identifies this raw material
   * within the laboratory's inventory system.
   *
   * @remarks
   * The code is used for traceability, procurement, and regulatory documentation.
   * Its format may follow internal conventions or industry standards such as
   * CAS numbers or pharmacopeial codes.
   */
  code: string;

  /**
   * The name of the external supplier or vendor that provides this raw material.
   *
   * @remarks
   * Tracking the supplier is essential for quality audits, regulatory compliance,
   * and supply chain management. A change in supplier may require re-qualification
   * under GMP or ISO standards.
   */
  supplier: string;

  /**
   * The batch or lot number assigned by the supplier for this specific delivery
   * of the raw material.
   *
   * @remarks
   * The batch number is critical for traceability in pharmaceutical manufacturing.
   * It allows the laboratory to link a raw material to the finished products it
   * was used in, enabling targeted recalls or investigations if quality issues arise.
   */
  batchNumber: string;

  /**
   * The expiration date of this raw material batch.
   *
   * @remarks
   * Stored as an ISO 8601 date string (e.g., `'2026-12-31'`). Expired materials
   * must not be used in production or analysis, and their presence in stock should
   * trigger disposal or quarantine workflows according to regulatory procedures.
   */
  expirationDate: string;

  /**
   * The current quantity of this raw material available in stock.
   *
   * @remarks
   * This value is expressed in the unit defined by the {@link unit} field.
   * It should be updated whenever stock is consumed, received, or adjusted
   * through inventory reconciliation processes.
   */
  quantityInStock: number;

  /**
   * The unit of measurement used for stock quantities of this raw material.
   *
   * @remarks
   * Common values include `'kg'`, `'g'`, `'L'`, `'mL'`, or `'units'`, depending
   * on the physical nature of the material. This unit applies to both
   * {@link quantityInStock} and {@link minimumStock}.
   */
  unit: string;

  /**
   * The minimum stock threshold below which a restocking action should be triggered.
   *
   * @remarks
   * When {@link quantityInStock} falls at or below this value, the system should
   * alert the responsible personnel or initiate a procurement request to avoid
   * production interruptions due to material shortage.
   */
  minimumStock: number;

  /**
   * The ISO 8601 timestamp indicating when this raw material record was created.
   */
  createdAt: string;

  /**
   * Creates a new RawMaterial entity.
   *
   * @param params - Initialization properties
   * @param params.id - The unique identifier for the raw material
   * @param params.labId - The identifier of the owning laboratory
   * @param params.name - The common or chemical name of the raw material
   * @param params.code - The internal catalog code of the raw material
   * @param params.supplier - The name of the supplier or vendor
   * @param params.batchNumber - The supplier-assigned batch or lot number
   * @param params.expirationDate - The expiration date in ISO 8601 format
   * @param params.quantityInStock - The current quantity available in stock
   * @param params.unit - The unit of measurement for stock quantities
   * @param params.minimumStock - The minimum stock threshold for restocking alerts
   * @param params.createdAt - The creation timestamp in ISO 8601 format
   *
   * @remarks
   * The constructor initializes all fields directly from the provided params object.
   * All fields are required and no defaults are applied.
   */
  constructor(params: {
    id: string;
    labId: string;
    name: string;
    code: string;
    supplier: string;
    batchNumber: string;
    expirationDate: string;
    quantityInStock: number;
    unit: string;
    minimumStock: number;
    createdAt: string;
  }) {
    this.id = params.id;
    this.labId = params.labId;
    this.name = params.name;
    this.code = params.code;
    this.supplier = params.supplier;
    this.batchNumber = params.batchNumber;
    this.expirationDate = params.expirationDate;
    this.quantityInStock = params.quantityInStock;
    this.unit = params.unit;
    this.minimumStock = params.minimumStock;
    this.createdAt = params.createdAt;
  }
}
