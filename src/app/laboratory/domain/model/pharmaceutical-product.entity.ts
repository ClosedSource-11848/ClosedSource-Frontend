import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a pharmaceutical product entity within the Pharmaceutical domain.
 *
 * @remarks
 * In Domain-Driven Design, a PharmaceuticalProduct is an entity that models a
 * registered drug or pharmaceutical item manufactured or distributed by a laboratory.
 * Each product has a unique identity that persists throughout its lifecycle and is
 * always associated with the laboratory that produces it.
 *
 * This entity encapsulates the core attributes of a pharmaceutical product as
 * understood within the domain, including its internal code, technical specifications,
 * and its current active status within the system.
 *
 * @example
 * ```typescript
 * const product = new PharmaceuticalProduct({
 *   id: 'prod-001',
 *   labId: 'lab-123',
 *   code: 'MED-2024-001',
 *   name: 'Amoxicilina 500mg',
 *   description: 'Antibiótico de amplio espectro en cápsulas',
 *   specifications: 'Cápsulas de 500mg, blister x 12 unidades',
 *   active: true,
 *   createdAt: '2024-03-01T09:00:00Z',
 * });
 *
 * console.log(product.name);  // 'Amoxicilina 500mg'
 * console.log(product.active); // true
 * ```
 */
export class PharmaceuticalProduct implements BaseEntity {
  /**
   * The unique identifier for this pharmaceutical product.
   */
  id: string;

  /**
   * The identifier of the laboratory that manufactures or owns this product.
   *
   * @remarks
   * This field establishes the relationship between the product and its parent
   * {@link Laboratory} entity. It acts as a foreign reference within the domain,
   * linking the product to the laboratory responsible for it.
   */
  labId: string;

  /**
   * The internal registration code that uniquely identifies this product
   * within the laboratory's catalog.
   *
   * @remarks
   * The code is typically used for traceability, inventory management, and
   * regulatory reporting purposes. Its format may vary depending on the
   * laboratory's internal conventions or regulatory requirements.
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
   * This field provides general information about the product, such as its
   * therapeutic use, presentation form, or any relevant clinical context
   * visible to users of the system.
   */
  description: string;

  /**
   * The technical specifications of the pharmaceutical product.
   *
   * @remarks
   * Specifications typically include details such as concentration, dosage form,
   * packaging units, storage conditions, and other quality or manufacturing
   * parameters required for regulatory compliance.
   */
  specifications: string;

  /**
   * Indicates whether this pharmaceutical product is currently active in the system.
   *
   * @remarks
   * An inactive product (`false`) is retained in the system for historical and
   * traceability purposes but should not be available for new operations such as
   * batch creation or regulatory submissions.
   */
  active: boolean;

  /**
   * The ISO 8601 timestamp indicating when this pharmaceutical product record was created.
   */
  createdAt: string;

  /**
   * Creates a new PharmaceuticalProduct entity.
   *
   * @param params - Initialization properties
   * @param params.id - The unique identifier for the product
   * @param params.labId - The identifier of the owning laboratory
   * @param params.code - The internal registration code of the product
   * @param params.name - The commercial or scientific name of the product
   * @param params.description - A human-readable description of the product
   * @param params.specifications - The technical specifications of the product
   * @param params.active - Whether the product is currently active in the system
   * @param params.createdAt - The creation timestamp in ISO 8601 format
   *
   * @remarks
   * The constructor initializes all fields directly from the provided params object.
   * All fields are required and no defaults are applied.
   */
  constructor(params: {
    id: string;
    labId: string;
    code: string;
    name: string;
    description: string;
    specifications: string;
    active: boolean;
    createdAt: string;
  }) {
    this.id = params.id;
    this.labId = params.labId;
    this.code = params.code;
    this.name = params.name;
    this.description = params.description;
    this.specifications = params.specifications;
    this.active = params.active;
    this.createdAt = params.createdAt;
  }
}
