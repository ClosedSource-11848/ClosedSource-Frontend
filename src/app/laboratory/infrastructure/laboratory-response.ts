import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Represents the raw API response shape for a single laboratory resource
 * as returned by the remote server.
 *
 * @remarks
 * `LaboratoryResource` extends {@link BaseResource} to inherit any common
 * envelope fields defined at the infrastructure level. It models the deserialized
 * JSON object received from the server and serves as the input type for
 * {@link LaboratoryAssembler}, which maps it into a {@link Laboratory} domain entity.
 *
 * This interface belongs to the infrastructure layer and must not be consumed
 * directly by the application or domain layers. Any consumer needing laboratory
 * data should operate on the {@link Laboratory} entity instead.
 *
 * @example
 * ```typescript
 * const resource: LaboratoryResource = {
 * id: 123,
 * name: 'BioLab Peru S.A.C.',
 * ruc: '20512345678',
 * address: 'Av. Industrial 456, Lima',
 * phone: '+51 1 234-5678',
 * applicableRegulations: ['ISO 17025', 'DIGEMID'],
 * createdAt: '2024-01-15T08:00:00Z',
 * updatedAt: '2024-06-10T12:30:00Z',
 * };
 * ```
 */
export interface LaboratoryResource extends BaseResource {
  /** The unique numeric identifier of the laboratory as assigned by the server. */
  id: number;

  /** The official registered name of the laboratory. */
  name: string;

  /**
   * The tax identification number (RUC) of the laboratory.
   *
   * @remarks
   * RUC (Registro Único de Contribuyentes) is the unique taxpayer registry
   * number used in Peru to identify legal entities. This field is read-only
   * from the client perspective and must not be included in update requests.
   */
  ruc: string;

  /** The physical address of the laboratory as stored on the server. */
  address: string;

  /** The contact phone number of the laboratory as stored on the server. */
  phone: string;

  /**
   * The list of regulatory frameworks or standards applicable to this laboratory.
   *
   * @remarks
   * Reflects the full current set of regulations stored for this laboratory
   * (e.g., `'ISO 17025'`, `'DIGEMID'`, `'GMP'`). Mapped directly from the
   * server response without transformation.
   */
  applicableRegulations: string[];

  /** The ISO 8601 timestamp indicating when the laboratory record was created on the server. */
  createdAt: string;

  /** The ISO 8601 timestamp indicating when the laboratory record was last updated on the server. */
  updatedAt: string;
}

/**
 * Represents the raw API response shape for a collection of laboratory resources
 * as returned by the remote server.
 *
 * @remarks
 * `LaboratoriesResponse` extends {@link BaseResponse} to inherit any common
 * collection envelope fields defined at the infrastructure level (e.g., pagination
 * metadata or status wrappers). It wraps an array of {@link LaboratoryResource}
 * objects and serves as the deserialized response type for list-based endpoints.
 *
 * As with {@link LaboratoryResource}, this interface belongs to the infrastructure
 * layer and must not be consumed directly by the application or domain layers.
 *
 * @example
 * ```typescript
 * const response: LaboratoriesResponse = {
 * laboratories: [
 * {
 * id: 123,
 * name: 'BioLab Peru S.A.C.',
 * ruc: '20512345678',
 * address: 'Av. Industrial 456, Lima',
 * phone: '+51 1 234-5678',
 * applicableRegulations: ['ISO 17025'],
 * createdAt: '2024-01-15T08:00:00Z',
 * updatedAt: '2024-06-10T12:30:00Z',
 * }
 * ]
 * };
 * ```
 */
export interface LaboratoriesResponse extends BaseResponse {
  /**
   * The array of laboratory resources returned by the server.
   *
   * @remarks
   * Each element must be mapped to a {@link Laboratory} domain entity via
   * {@link LaboratoryAssembler} before being consumed by the application
   * or presentation layers.
   */
  laboratories: LaboratoryResource[];
}
