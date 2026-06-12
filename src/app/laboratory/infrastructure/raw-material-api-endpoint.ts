import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { RawMaterial } from '../domain/model/raw-material.entity';
import { RawMaterialResource, RawMaterialsResponse } from './raw-material-response';
import { RawMaterialAssembler } from './raw-material-assembler';
import { CreateRawMaterialRequest } from './raw-material.request';
import { MessageResource } from '../../shared/infrastructure/message-response';

/**
 * Base URL for all laboratory-related HTTP endpoints, composed from the
 * server base path and the laboratory-specific path defined in the
 * environment configuration. Resolved once at module load time.
 */
const labEndpointUrl = `${environment.serverBasePath}${environment.laboratoryLabsEndpointPath}`;

/**
 * HTTP endpoint handler for raw material operations within the Laboratory domain.
 *
 * @remarks
 * `RawMaterialApiEndpoint` extends {@link BaseApiEndpoint} specializing it with
 * {@link RawMaterial} as the domain entity, {@link RawMaterialResource} as the
 * single resource shape, {@link RawMaterialsResponse} as the collection response
 * shape, and {@link RawMaterialAssembler} for mapping between both representations.
 *
 * This class is not managed by Angular's DI container and is instantiated
 * directly by {@link LaboratoryApi}, which owns its lifecycle and provides
 * the shared {@link HttpClient} instance. Each method maps the raw API resource
 * to a domain entity via the assembler and delegates error handling to the
 * base class `handleError` utility.
 *
 * @example
 * ```typescript
 * const endpoint = new RawMaterialApiEndpoint(http);
 * endpoint.getRawMaterialsByLab(123).subscribe(materials => console.log(materials.length));
 * ```
 */
export class RawMaterialApiEndpoint extends BaseApiEndpoint<
  RawMaterial,
  RawMaterialResource,
  RawMaterialsResponse,
  RawMaterialAssembler
> {
  /**
   * Creates an instance of `RawMaterialApiEndpoint`.
   *
   * @param http - The Angular `HttpClient` instance forwarded from {@link LaboratoryApi},
   * passed to the base class to perform HTTP requests.
   *
   * @remarks
   * The {@link RawMaterialAssembler} is instantiated here rather than injected,
   * as this class operates outside Angular's DI container.
   */
  constructor(http: HttpClient) {
    super(http, labEndpointUrl, new RawMaterialAssembler());
  }

  /**
   * Retrieves all raw materials registered under a specific laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory whose raw materials to retrieve.
   * @returns An `Observable` that emits an array of {@link RawMaterial} domain
   * entities mapped from the server response.
   *
   * @remarks
   * Performs an HTTP `GET` to `{labEndpointUrl}/{labId}/raw-materials`. The raw
   * {@link RawMaterialsResponse} is mapped via
   * {@link RawMaterialAssembler.toEntitiesFromResponse}. Errors are forwarded
   * through the base class error handler.
   */
  getRawMaterialsByLab(labId: number): Observable<RawMaterial[]> {
    return this.http.get<RawMaterialResource[]>(`${this.endpointUrl}/${labId}/raw-materials`).pipe(
      map((resources) =>
        resources.map((resource) => this.assembler.toEntityFromResource(resource)),
      ),
      catchError(this.handleError(`Failed to fetch raw materials for lab ${labId}`)),
    );
  }

  /**
   * Retrieves all raw materials whose current stock level is at or below
   * their defined minimum stock threshold.
   *
   * @param labId - The unique numeric identifier of the laboratory to check for low-stock materials.
   * @returns An `Observable` that emits an array of {@link RawMaterial} domain
   * entities that require restocking attention.
   *
   * @remarks
   * Performs an HTTP `GET` to `{labEndpointUrl}/{labId}/raw-materials/low-stock`.
   * The raw {@link RawMaterialsResponse} is mapped via
   * {@link RawMaterialAssembler.toEntitiesFromResponse}. Errors are forwarded
   * through the base class error handler. See {@link RawMaterial.minimumStock}
   * for the threshold definition used to determine low-stock status.
   */
  getLowStockMaterials(labId: number): Observable<RawMaterial[]> {
    return this.http
      .get<RawMaterialResource[]>(`${this.endpointUrl}/${labId}/raw-materials?lowStock=true`)
      .pipe(
        map((resources) =>
          resources.map((resource) => this.assembler.toEntityFromResource(resource)),
        ),
        catchError(this.handleError(`Failed to fetch low stock materials for lab ${labId}`)),
      );
  }

  /**
   * Creates a new raw material entry under a specific laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory to register the material under.
   * @param request - The {@link CreateRawMaterialRequest} payload containing
   * the new material's inventory and traceability details.
   * @returns An `Observable` that emits the newly created {@link RawMaterial}
   * domain entity as returned by the server.
   *
   * @remarks
   * Performs an HTTP `POST` to `{labEndpointUrl}/{labId}/raw-materials` with the
   * request body serialized as JSON. The server is expected to return the created
   * {@link RawMaterialResource}, which is then mapped via
   * {@link RawMaterialAssembler.toEntityFromResource}. Errors are forwarded
   * through the base class error handler.
   */
  createRawMaterial(labId: number, request: CreateRawMaterialRequest): Observable<MessageResource> {
    return this.http
      .post<MessageResource>(`${this.endpointUrl}/${labId}/raw-materials`, request)
      .pipe(catchError(this.handleError('Failed to create raw material')));
  }
}
