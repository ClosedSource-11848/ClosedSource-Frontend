/**
 * Represents the intention to allocate or associate a raw material with a manufacturing process.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this Command belongs to the application layer.
 * It encapsulates the specific intent to link raw materials (e.g., to a production Batch),
 * acting as a boundary contract for the use case.
 *
 * Note: This structure is currently defined as an empty contract (marker interface) and
 * may be expanded with specific identity and quantity properties (such as `batchId`,
 * `materialId`, and `amount`) as the domain requirements evolve.
 *
 * @example
 * ```typescript
 * const command: LinkRawMaterialCommand = {};
 *
 * await linkRawMaterialUseCase.execute(command);
 *
 ```
 *
 * @author Qualitrack
 */
export interface LinkRawMaterialCommand {
  rawMaterialId: number;
  quantityUsed: number;
}
