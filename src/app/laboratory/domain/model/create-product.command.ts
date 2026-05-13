/**
 * Represents the command payload for creating a new pharmaceutical product
 * within the Laboratory domain.
 *
 * @remarks
 * In Command Query Responsibility Segregation (CQRS), a command encapsulates
 * the intent to perform a state-changing operation. This command carries the
 * minimum required data to register a new {@link PharmaceuticalProduct} under
 * a specific laboratory.
 *
 * This interface is intended to be used as the input contract for the
 * corresponding use case or application service responsible for product creation.
 * It does not include system-generated fields such as `id`, `active`, or
 * `createdAt`, as those are assigned by the domain or persistence layer.
 *
 * @example
 * ```typescript
 * const command: CreateProductCommand = {
 *   labId: 'lab-123',
 *   code: 'MED-2024-001',
 *   name: 'Amoxicilina 500mg',
 *   description: 'Antibiótico de amplio espectro en cápsulas',
 *   specifications: 'Cápsulas de 500mg, blister x 12 unidades',
 * };
 * ```
 */
export interface CreateProductCommand {
  /**
   * The identifier of the laboratory under which the product will be registered.
   *
   * @remarks
   * This field scopes the new product to a specific {@link Laboratory} entity,
   * ensuring that the product is created within the correct organizational context.
   */
  labId: string;

  /**
   * The internal catalog code that will uniquely identify the product
   * within the laboratory's inventory system.
   *
   * @remarks
   * The code must be unique per laboratory and may follow internal conventions
   * or regulatory standards such as pharmacopeial or CAS-based identifiers.
   */
  code: string;

  /**
   * The commercial or scientific name of the pharmaceutical product.
   */
  name: string;

  /**
   * A human-readable description of the pharmaceutical product.
   *
   * @remarks
   * Should convey the product's therapeutic purpose, presentation form,
   * or any relevant clinical context that helps users identify it within
   * the system.
   */
  description: string;

  /**
   * The technical specifications of the pharmaceutical product.
   *
   * @remarks
   * Typically includes concentration, dosage form, packaging details, storage
   * conditions, and other quality parameters required for regulatory compliance
   * and manufacturing traceability.
   */
  specifications: string;
}
