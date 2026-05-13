import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { PharmaceuticalProduct } from '../domain/model/pharmaceutical-product.entity';
import { PharmaceuticalProductResource, PharmaceuticalProductsResponse } from './product-response';
import { ProductAssembler } from './product-assembler';
import { CreateProductRequest } from './product.request';

/**
 * Base URL for all laboratory-related HTTP endpoints, composed from the
 * server base path and the laboratory-specific path defined in the
 * environment configuration. Resolved once at module load time.
 */
const labEndpointUrl = `${environment.serverBasePath}${environment.laboratoryLabsEndpointPath}`;

/**
 * HTTP endpoint handler for pharmaceutical product operations within the Laboratory domain.
 *
 * @remarks
 * `ProductApiEndpoint` extends {@link BaseApiEndpoint} specializing it with
 * {@link PharmaceuticalProduct} as the domain entity, {@link PharmaceuticalProductResource}
 * as the single resource shape, {@link PharmaceuticalProductsResponse} as the collection
 * response shape, and {@link ProductAssembler} for mapping between both representations.
 *
 * This class is not managed by Angular's DI container and is instantiated
 * directly by {@link LaboratoryApi}, which owns its lifecycle and provides
 * the shared {@link HttpClient} instance. Each method maps the raw API resource
 * to a domain entity via the assembler and delegates error handling to the
 * base class `handleError` utility.
 *
 * @example
 * ```typescript
 * const endpoint = new ProductApiEndpoint(http);
 * endpoint.getProductsByLab('lab-123').subscribe(products => console.log(products.length));
 * ```
 */
export class ProductApiEndpoint extends BaseApiEndpoint<
PharmaceuticalProduct,
  PharmaceuticalProductResource,
  PharmaceuticalProductsResponse,
ProductAssembler
> {
  /**
   * Creates an instance of `ProductApiEndpoint`.
   *
   * @param http - The Angular `HttpClient` instance forwarded from {@link LaboratoryApi},
   * passed to the base class to perform HTTP requests.
   *
   * @remarks
   * The {@link ProductAssembler} is instantiated here rather than injected,
   * as this class operates outside Angular's DI container.
   */
  constructor(http: HttpClient) {
    super(http, labEndpointUrl, new ProductAssembler());
  }

  /**
   * Retrieves all pharmaceutical products registered under a specific laboratory.
   *
   * @param labId - The unique identifier of the laboratory whose products to retrieve.
   * @returns An `Observable` that emits an array of {@link PharmaceuticalProduct}
   * domain entities mapped from the server response.
   *
   * @remarks
   * Performs an HTTP `GET` to `{labEndpointUrl}/{labId}/products`. The raw
   * {@link PharmaceuticalProductsResponse} is mapped via
   * {@link ProductAssembler.toEntitiesFromResponse}. Errors are forwarded
   * through the base class error handler.
   */
  getProductsByLab(labId: string): Observable<PharmaceuticalProduct[]> {
    return this.http
      .get<PharmaceuticalProductsResponse>(`${this.endpointUrl}/${labId}/products`)
      .pipe(
        map((response) => this.assembler.toEntitiesFromResponse(response)),
        catchError(this.handleError(`Failed to fetch products for lab ${labId}`)),
      );
  }

  /**
   * Creates a new pharmaceutical product under a specific laboratory.
   *
   * @param labId - The unique identifier of the laboratory to register the product under.
   * @param request - The {@link CreateProductRequest} payload containing
   * the new product's details.
   * @returns An `Observable` that emits the newly created {@link PharmaceuticalProduct}
   * domain entity as returned by the server.
   *
   * @remarks
   * Performs an HTTP `POST` to `{labEndpointUrl}/{labId}/products` with the request
   * body serialized as JSON. The server is expected to return the created
   * {@link PharmaceuticalProductResource}, which is then mapped via
   * {@link ProductAssembler.toEntityFromResource}. Errors are forwarded
   * through the base class error handler.
   */
  createProduct(labId: string, request: CreateProductRequest): Observable<PharmaceuticalProduct> {
    return this.http
      .post<PharmaceuticalProductResource>(`${this.endpointUrl}/${labId}/products`, request)
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to create pharmaceutical product')),
      );
  }
}
