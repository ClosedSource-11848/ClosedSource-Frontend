/**
 * Represents the command payload for registering a new raw material
 * within the Laboratory domain.
 *
 * @remarks
 * In Command Query Responsibility Segregation (CQRS), a command encapsulates
 * the intent to perform a state-changing operation. This command carries the
 * minimum required data to register a new {@link RawMaterial} under a specific
 * laboratory, including its inventory state at the time of entry.
 *
 * This interface is intended to be used as the input contract for the
 * corresponding use case or application service responsible for raw material
 * registration. It does not include system-generated fields such as `id` or
 * `createdAt`, as those are assigned by the domain or persistence layer.
 *
 * @example
 * ```typescript
 * const command: CreateRawMaterialCommand = {
 * labId: 123,
 * name: 'Ethanol 96',
 * code: 'RM-ETH-96',
 * supplier: 'ChemCorp S.A.C.',
 * batchNumber: 'LOTE-2024-045',
 * expirationDate: '2026-12-31',
 * quantityInStock: 150,
 * unit: 'L',
 * minimumStock: 20,
 * };
 * ```
 */
export interface CreateRawMaterialCommand {
  /**
   * The numeric identifier of the laboratory under which the raw material will be registered.
   *
   * @remarks
   * This field scopes the new raw material to a specific {@link Laboratory} entity,
   * ensuring that inventory tracking and stock management are contained within
   * the correct organizational context.
   */
  labId: number;

  /**
   * The common or chemical name of the raw material.
   */
  name: string;

  /**
   * The internal catalog code that will uniquely identify this raw material
   * within the laboratory's inventory system.
   *
   * @remarks
   * The code must be unique per laboratory and may follow internal conventions
   * or industry standards such as CAS numbers or pharmacopeial identifiers.
   */
  code: string;

  /**
   * The name of the external supplier or vendor providing this raw material.
   *
   * @remarks
   * Supplier information is required at registration time to support quality
   * audits, regulatory compliance, and supply chain traceability from the
   * moment the material enters the laboratory's inventory.
   */
  supplier: string;

  /**
   * The batch or lot number assigned by the supplier for this specific delivery.
   *
   * @remarks
   * The batch number must be captured at registration to enable end-to-end
   * traceability between incoming raw materials and the finished pharmaceutical
   * products they are used in. It is essential for targeted recalls or
   * quality investigations.
   */
  batchNumber: string;

  /**
   * The expiration date of this raw material batch.
   *
   * @remarks
   * Must be provided as an ISO 8601 date string (e.g., `'2026-12-31'`).
   * The use case layer should validate that this date is in the future
   * at the time of registration to prevent expired materials from
   * entering active inventory.
   */
  expirationDate: string;

  /**
   * The initial quantity of this raw material being registered into stock.
   *
   * @remarks
   * This value is expressed in the unit defined by the {@link unit} field.
   * It represents the stock level at the moment of registration and will
   * be updated by subsequent inventory operations such as consumption or replenishment.
   */
  quantityInStock: number;

  /**
   * The unit of measurement for the stock quantities of this raw material.
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
   * When the current stock level falls at or below this value, the system should
   * alert responsible personnel or initiate a procurement request. This value
   * is expressed in the same unit as {@link quantityInStock}.
   */
  minimumStock: number;
}
