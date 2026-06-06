/**
 * Represents the HTTP request body for creating a new pharmaceutical product
 * within the Laboratory API.
 *
 * @remarks
 * This interface defines the inbound data contract expected by the create product
 * endpoint. It models the deserialized JSON body of the HTTP request and is
 * responsible for carrying user-provided input from the presentation layer to
 * the application layer, where it is typically mapped into a
 * {@link CreateProductCommand} before being processed by the use case.
 *
 * It does not include system-generated fields such as `id`, `active`, or
 * `createdAt`, as those are assigned by the domain or persistence layer.
 * Newly created products are considered active by default.
 *
 * @example
 * ```typescript
 * const body: CreateProductRequest = {
 * labId: 123,
 * code: 'MED-2024-001',
 * name: 'Amoxicilina 500mg',
 * description: 'Antibiótico de amplio espectro en cápsulas',
 * specifications: 'Cápsulas de 500mg, blister x 12 unidades',
 * };
 * ```
 */
export interface CreateProductRequest {
  /** The numeric identifier of the laboratory under which the product will be registered. */
  labId: number;

  /**
   * The internal catalog code that will uniquely identify the product
   * within the laboratory's inventory system.
   *
   * @remarks
   * The controller layer should validate that this code does not already exist
   * for the given laboratory before forwarding the request to the application layer.
   */
  code: string;

  /** The commercial or scientific name of the pharmaceutical product. */
  name: string;

  /** A human-readable description of the pharmaceutical product. */
  description: string;

  /**
   * The technical specifications of the pharmaceutical product.
   *
   * @remarks
   * Typically includes concentration, dosage form, packaging details, storage
   * conditions, and other quality parameters required for regulatory compliance.
   */
  specifications: string;
}
