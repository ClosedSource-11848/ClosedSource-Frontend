import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Laboratory } from '../domain/model/laboratory.entity';
import { LaboratoryResource, LaboratoriesResponse } from './laboratory-response';
import { LaboratoryAssembler } from './laboratory-assembler';
import { UpdateLaboratoryRequest } from './laboratory.request';

/**
 * Base URL for all laboratory-related HTTP endpoints, composed from the
 * server base path and the laboratory-specific path defined in the
 * environment configuration. Resolved once at module load time.
 */
const labEndpointUrl = `${environment.serverBasePath}${environment.laboratoryLabsEndpointPath}`;

/**
 * HTTP endpoint handler for laboratory profile operations within the Laboratory domain.
 *
 * @remarks
 * `LaboratoryApiEndpoint` extends {@link BaseApiEndpoint} specializing it with
 * {@link Laboratory} as the domain entity, {@link LaboratoryResource} as the
 * single resource shape, {@link LaboratoriesResponse} as the collection response
 * shape, and {@link LaboratoryAssembler} for mapping between both representations.
 *
 * This class is not managed by Angular's DI container and is instantiated
 * directly by {@link LaboratoryApi}, which owns its lifecycle and provides
 * the shared {@link HttpClient} instance. Each method maps the raw API resource
 * to a domain entity via the assembler and delegates error handling to the
 * base class `handleError` utility.
 *
 * @example
 * ```typescript
 * const endpoint = new LaboratoryApiEndpoint(http);
 * endpoint.getByLabId(123).subscribe(lab => console.log(lab.name));
 * ```
 */
export class LaboratoryApiEndpoint extends BaseApiEndpoint<
  Laboratory,
  LaboratoryResource,
  LaboratoriesResponse,
  LaboratoryAssembler
> {
  /**
   * Creates an instance of `LaboratoryApiEndpoint`.
   *
   * @param http - The Angular `HttpClient` instance forwarded from {@link LaboratoryApi},
   * passed to the base class to perform HTTP requests.
   *
   * @remarks
   * The {@link LaboratoryAssembler} is instantiated here rather than injected,
   * as this class operates outside Angular's DI container.
   */
  constructor(http: HttpClient) {
    super(http, labEndpointUrl, new LaboratoryAssembler());
  }

  /**
   * Retrieves the profile of a laboratory by its unique identifier.
   *
   * @param labId - The unique numeric identifier of the laboratory to retrieve.
   * @returns An `Observable` that emits the {@link Laboratory} domain entity
   * mapped from the server response.
   *
   * @remarks
   * Performs an HTTP `GET` to `{labEndpointUrl}/{labId}`. The raw
   * {@link LaboratoryResource} is mapped via
   * {@link LaboratoryAssembler.toEntityFromResource}. Errors are forwarded
   * through the base class error handler.
   */
  getByLabId(labId: number): Observable<Laboratory> {
    return this.http.get<LaboratoryResource>(`${this.endpointUrl}/${labId}`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to fetch laboratory ${labId}`)),
    );
  }

  /**
   * Updates the profile information of an existing laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory to update.
   * @param request - The {@link UpdateLaboratoryRequest} payload containing
   * the new values for the laboratory's mutable fields.
   * @returns An `Observable` that emits the updated {@link Laboratory} domain
   * entity as returned by the server after applying the changes.
   *
   * @remarks
   * Performs an HTTP `PUT` to `{labEndpointUrl}/{labId}` with the request body
   * serialized as JSON. The server is expected to return the full updated
   * {@link LaboratoryResource}, which is then mapped via
   * {@link LaboratoryAssembler.toEntityFromResource}. Errors are forwarded
   * through the base class error handler.
   */
  updateLaboratory(labId: number, request: UpdateLaboratoryRequest): Observable<Laboratory> {
    return this.http.put<LaboratoryResource>(`${this.endpointUrl}/${labId}`, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to update laboratory ${labId}`)),
    );
  }
}
