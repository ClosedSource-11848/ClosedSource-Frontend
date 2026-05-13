/**
 * Represents the HTTP request body for updating the profile information
 * of an existing laboratory within the Laboratory API.
 *
 * @remarks
 * This interface defines the inbound data contract expected by the update
 * laboratory endpoint. It models the deserialized JSON body of the HTTP request
 * and is responsible for carrying user-provided input from the presentation
 * layer to the application layer, where it is typically mapped into an
 * {@link UpdateLaboratoryCommand} before being processed by the use case.
 *
 * It deliberately excludes immutable or system-managed fields such as `id`,
 * `ruc`, or `createdAt`, as those must not be modified through this endpoint.
 *
 * @example
 * ```typescript
 * const body: UpdateLaboratoryRequest = {
 *   name: 'BioLab Peru S.A.C.',
 *   address: 'Av. Industrial 789, Lima',
 *   phone: '+51 1 987-6543',
 *   applicableRegulations: ['ISO 17025', 'DIGEMID', 'GMP'],
 * };
 * ```
 */
export interface UpdateLaboratoryRequest {
  /** The updated official registered name of the laboratory. */
  name: string;

  /** The updated physical address of the laboratory. */
  address: string;

  /**
   * The updated contact phone number of the laboratory.
   *
   * @remarks
   * The controller layer may apply format validation to ensure the provided
   * value conforms to the expected phone number structure before forwarding
   * the request to the application layer.
   */
  phone: string;

  /**
   * The updated list of regulatory frameworks or standards applicable to this laboratory.
   *
   * @remarks
   * This field is treated as a full replacement of the existing regulations list,
   * not a partial merge. The controller layer should validate that all entries
   * are non-empty strings before forwarding the request to the application layer.
   */
  applicableRegulations: string[];
}
