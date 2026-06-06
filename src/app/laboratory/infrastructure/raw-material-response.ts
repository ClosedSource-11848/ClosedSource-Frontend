import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Represents the raw API response shape for a single raw material resource
 * as returned by the remote server.
 *
 * @remarks
 * `RawMaterialResource` extends {@link BaseResource} to inherit any common
 * envelope fields defined at the infrastructure level. It models the deserialized
 * JSON object received from the server and serves as the input type for
 * `RawMaterialAssembler`, which maps it into a {@link RawMaterial} domain entity.
 *
 * This interface belongs to the infrastructure layer and must not be consumed
 * directly by the application or domain layers. Any consumer needing raw material
 * data should operate on the {@link RawMaterial} entity instead.
 *
 * @example
 * ```typescript
 * const resource: RawMaterialResource = {
 * id: 1,
 * labId: 123,
 * name: 'Etanol 96°',
 * code: 'RM-ETH-96',
 * supplier: 'QuimicaPeru S.A.C.',
 * batchNumber: 'LOTE-2024-045',
 * expirationDate: '2026-12-31',
 * quantityInStock: 150,
 * unit: 'L',
 * minimumStock: 20,
 * createdAt: '2024-04-10T07:30:00Z',
 * };
 * ```
 */
export interface RawMaterialResource extends BaseResource {
  /** The unique numeric identifier of the raw material as assigned by the server. */
  id: number;

  /** The numeric identifier of the laboratory that owns this raw material. */
  labId: number;

  /** The common or chemical name of the raw material. */
  name: string;

  /** The internal catalog code that uniquely identifies this raw material within the laboratory. */
  code: string;

  /** The name of the external supplier or vendor that provides this raw material. */
  supplier: string;

  /**
   * The batch or lot number assigned by the supplier for this specific delivery.
   *
   * @remarks
   * Essential for end-to-end traceability between incoming raw materials and
   * the finished products they are used in, enabling targeted recalls or
   * quality investigations.
   */
  batchNumber: string;

  /**
   * The expiration date of this raw material batch as stored on the server.
   *
   * @remarks
   * Represented as an ISO 8601 date string (e.g., `'2026-12-31'`). Expired
   * materials must not be used in production or analysis processes.
   */
  expirationDate: string;

  /**
   * The current quantity of this raw material available in stock.
   *
   * @remarks
   * Expressed in the unit defined by the {@link unit} field. Reflects the
   * stock level as last recorded by the server.
   */
  quantityInStock: number;

  /**
   * The unit of measurement for stock quantities of this raw material.
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
   * Expressed in the same unit as {@link quantityInStock}. When the current
   * stock falls at or below this value, procurement or alert workflows should
   * be initiated.
   */
  minimumStock: number;

  /** The ISO 8601 timestamp indicating when the raw material record was created on the server. */
  createdAt: string;
}

/**
 * Represents the raw API response shape for a collection of raw material
 * resources as returned by the remote server.
 *
 * @remarks
 * `RawMaterialsResponse` extends {@link BaseResponse} to inherit any common
 * collection envelope fields defined at the infrastructure level (e.g.,
 * pagination metadata or status wrappers). It wraps an array of
 * {@link RawMaterialResource} objects and serves as the deserialized response
 * type for list-based endpoints that return multiple raw materials.
 *
 * As with {@link RawMaterialResource}, this interface belongs to the
 * infrastructure layer and must not be consumed directly by the application
 * or domain layers.
 *
 * @example
 * ```typescript
 * const response: RawMaterialsResponse = {
 * rawMaterials: [
 * {
 * id: 1,
 * labId: 123,
 * name: 'Etanol 96°',
 * code: 'RM-ETH-96',
 * supplier: 'QuimicaPeru S.A.C.',
 * batchNumber: 'LOTE-2024-045',
 * expirationDate: '2026-12-31',
 * quantityInStock: 150,
 * unit: 'L',
 * minimumStock: 20,
 * createdAt: '2024-04-10T07:30:00Z',
 * }
 * ]
 * };
 * ```
 */
export interface RawMaterialsResponse extends BaseResponse {
  /**
   * The array of raw material resources returned by the server.
   *
   * @remarks
   * Each element must be mapped to a {@link RawMaterial} domain entity via
   * `RawMaterialAssembler` before being consumed by the application or
   * presentation layers.
   */
  rawMaterials: RawMaterialResource[];
}
