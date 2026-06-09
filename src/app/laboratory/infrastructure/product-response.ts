import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Represents the raw API response shape for a single pharmaceutical product
 * resource as returned by the remote server.
 *
 * @remarks
 * `PharmaceuticalProductResource` extends {@link BaseResource} to inherit any
 * common envelope fields defined at the infrastructure level. It models the
 * deserialized JSON object received from the server and serves as the input
 * type for `PharmaceuticalProductAssembler`, which maps it into a
 * {@link PharmaceuticalProduct} domain entity.
 *
 * This interface belongs to the infrastructure layer and must not be consumed
 * directly by the application or domain layers. Any consumer needing product
 * data should operate on the {@link PharmaceuticalProduct} entity instead.
 *
 * @example
 * ```typescript
 * const resource: PharmaceuticalProductResource = {
 * id: 1,
 * labId: 123,
 * code: 'MED-2024-001',
 * name: 'Amoxicilina 500mg',
 * description: 'Antibiótico de amplio espectro en cápsulas',
 * specifications: 'Cápsulas de 500mg, blister x 12 unidades',
 * active: true,
 * createdAt: '2024-03-01T09:00:00Z',
 * };
 * ```
 */
export interface PharmaceuticalProductResource extends BaseResource {
  /** The unique numeric identifier of the product as assigned by the server. */
  id: number;

  /** The numeric identifier of the laboratory that owns this product. */
  laboratoryId: number;
  /** The internal catalog code that uniquely identifies this product within the laboratory. */
  code: string;

  /** The commercial or scientific name of the pharmaceutical product. */
  name: string;

  /** A human-readable description of the pharmaceutical product as stored on the server. */
  description: string;

  /**
   * The technical specifications of the pharmaceutical product as stored on the server.
   *
   * @remarks
   * Typically includes concentration, dosage form, packaging details, storage
   * conditions, and other quality parameters required for regulatory compliance.
   */
  specifications: string;

  /**
   * Indicates whether this pharmaceutical product is currently active.
   *
   * @remarks
   * An inactive product (`false`) is retained on the server for historical
   * traceability but should not be available for new operations such as
   * batch creation or regulatory submissions.
   */
  active: boolean;

  /** The ISO 8601 timestamp indicating when the product record was created on the server. */
  createdAt: string;
}

/**
 * Represents the raw API response shape for a collection of pharmaceutical
 * product resources as returned by the remote server.
 *
 * @remarks
 * `PharmaceuticalProductsResponse` extends {@link BaseResponse} to inherit any
 * common collection envelope fields defined at the infrastructure level (e.g.,
 * pagination metadata or status wrappers). It wraps an array of
 * {@link PharmaceuticalProductResource} objects and serves as the deserialized
 * response type for list-based endpoints that return multiple products.
 *
 * As with {@link PharmaceuticalProductResource}, this interface belongs to the
 * infrastructure layer and must not be consumed directly by the application or
 * domain layers.
 *
 * @example
 * ```typescript
 * const response: PharmaceuticalProductsResponse = {
 * products: [
 * {
 * id: 1,
 * labId: 123,
 * code: 'MED-2024-001',
 * name: 'Amoxicilina 500mg',
 * description: 'Antibiótico de amplio espectro en cápsulas',
 * specifications: 'Cápsulas de 500mg, blister x 12 unidades',
 * active: true,
 * createdAt: '2024-03-01T09:00:00Z',
 * }
 * ]
 * };
 * ```
 */
export interface PharmaceuticalProductsResponse extends BaseResponse {
  /**
   * The array of pharmaceutical product resources returned by the server.
   *
   * @remarks
   * Each element must be mapped to a {@link PharmaceuticalProduct} domain entity
   * via `PharmaceuticalProductAssembler` before being consumed by the application
   * or presentation layers.
   */
  products: PharmaceuticalProductResource[];
}
