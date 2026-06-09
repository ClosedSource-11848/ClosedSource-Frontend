/**
 * Represents the HTTP request body for registering a new raw material
 * within the Laboratory API.
 *
 * @remarks
 * This interface defines the inbound data contract expected by the create raw
 * material endpoint. It models the deserialized JSON body of the HTTP request
 * and is responsible for carrying user-provided input from the presentation
 * layer to the application layer, where it is typically mapped into a
 * {@link CreateRawMaterialCommand} before being processed by the use case.
 *
 * It does not include system-generated fields such as `id` or `createdAt`,
 * as those are assigned by the domain or persistence layer.
 *
 * @example
 * ```typescript
 * const body: CreateRawMaterialRequest = {
 * labId: 123,
 * name: 'Etanol 96°',
 * code: 'RM-ETH-96',
 * supplier: 'QuimicaPeru S.A.C.',
 * batchNumber: 'LOTE-2024-045',
 * expirationDate: '2026-12-31',
 * quantityInStock: 150,
 * unit: 'L',
 * minimumStock: 20,
 * };
 * ```
 */
export interface CreateRawMaterialRequest {
  /** The numeric identifier of the laboratory under which the raw material will be registered. */
  laboratoryId: number;

  /** The common or chemical name of the raw material. */
  name: string;

  /**
   * The internal catalog code that will uniquely identify this raw material
   * within the laboratory's inventory system.
   *
   * @remarks
   * The controller layer should validate that this code does not already exist
   * for the given laboratory before forwarding the request to the application layer.
   */
  code: string;

  /** The name of the external supplier or vendor providing this raw material. */
  supplier: string;

  /**
   * The batch or lot number assigned by the supplier for this specific delivery.
   *
   * @remarks
   * Must be captured at registration time to enable end-to-end traceability
   * between incoming raw materials and the finished products they are used in.
   */
  batchNumber: string;

  /**
   * The expiration date of this raw material batch.
   *
   * @remarks
   * Must be provided as an ISO 8601 date string (e.g., `'2026-12-31'`).
   * The controller layer should validate that this date is in the future
   * at the time of registration to prevent expired materials from
   * entering active inventory.
   */
  expirationDate: string;

  /**
   * The initial quantity of this raw material being registered into stock.
   *
   * @remarks
   * Expressed in the unit defined by the {@link unit} field. Represents the
   * stock level at the moment of registration and will be updated by subsequent
   * inventory operations such as consumption or replenishment.
   */
  quantityInStock: number;

  /**
   * The unit of measurement for the stock quantities of this raw material.
   *
   * @remarks
   * Common values include `'kg'`, `'g'`, `'L'`, `'mL'`, or `'units'`.
   * Applies to both {@link quantityInStock} and {@link minimumStock}.
   */
  unit: string;

  /**
   * The minimum stock threshold below which a restocking action should be triggered.
   *
   * @remarks
   * Expressed in the same unit as {@link quantityInStock}. When the current stock
   * falls at or below this value, the system should alert responsible personnel
   * or initiate a procurement request.
   */
  minimumStock: number;
}
