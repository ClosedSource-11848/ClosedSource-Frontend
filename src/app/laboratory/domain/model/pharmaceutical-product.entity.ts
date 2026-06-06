import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a pharmaceutical product entity within the Pharmaceutical domain.
 *
 * @remarks
 * In Domain-Driven Design, a PharmaceuticalProduct is an entity that models a
 * registered drug or pharmaceutical item manufactured or distributed by a laboratory.
 * Each product has a unique numeric identity that persists throughout its lifecycle and is
 * always associated with the laboratory that produces it.
 *
 * This entity encapsulates the core attributes of a pharmaceutical product as
 * understood within the domain, including its internal code, technical specifications,
 * and its current active status within the system.
 *
 * @example
 * ```typescript
 * const product = new PharmaceuticalProduct({
 * id: 1,
 * labId: '1',
 * code: 'MED-2024-001',
 * name: 'Amoxicilina 500mg',
 * description: 'Antibiótico de amplio espectro en cápsulas',
 * specifications: 'Cápsulas de 500mg, blister x 12 unidades',
 * active: true,
 * createdAt: '2024-03-01T09:00:00Z',
 * });
 *
 * console.log(product.name);  // 'Amoxicilina 500mg'
 * console.log(product.active); // true
 * ```
 */
export class PharmaceuticalProduct implements BaseEntity {
  /**
   * The unique numeric identifier for this pharmaceutical product.
   */
  id: number;

  /**
   * The numeric identifier of the laboratory that manufactures or owns this product.
   */
  labId: number;

  /**
   * The internal registration code that uniquely identifies this product
   * within the laboratory's catalog.
   */
  code: string;

  /**
   * The commercial or scientific name of the pharmaceutical product.
   */
  name: string;

  /**
   * A human-readable description of the pharmaceutical product.
   */
  description: string;

  /**
   * The technical specifications of the pharmaceutical product.
   */
  specifications: string;

  /**
   * Indicates whether this pharmaceutical product is currently active in the system.
   */
  active: boolean;

  /**
   * The ISO 8601 timestamp indicating when this pharmaceutical product record was created.
   */
  createdAt: string;

  constructor(params: {
    id: number;
    labId: number;
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
