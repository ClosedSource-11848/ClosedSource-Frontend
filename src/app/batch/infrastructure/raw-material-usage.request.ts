/**
 * Represents the incoming payload required to link a raw material to a batch.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this interface acts as a strict
 * data contract for the external presentation or infrastructure layer. It captures
 * the necessary input from the client to record the consumption of a specific
 * material, before being mapped into a domain-level structure.
 *
 * @example
 * ```typescript
 * const requestPayload: LinkRawMaterialRequest = {
 *   rawMaterialId: 'mat-045',
 *   quantityUsed: 150.5
 * };
 *
 ```
 *
 * @author Qualitrack
 */
export interface LinkRawMaterialRequest {
  /**
   * The identifier of the specific raw material to be linked or consumed.
   */
  rawMaterialId: string;

  /**
   * The exact amount of the raw material utilized in the production process.
   */
  quantityUsed: number;
}
