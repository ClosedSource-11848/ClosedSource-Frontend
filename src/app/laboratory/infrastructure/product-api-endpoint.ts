import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { PharmaceuticalProduct } from '../domain/model/pharmaceutical-product.entity';
import { PharmaceuticalProductResource, PharmaceuticalProductsResponse } from './product-response';
import { ProductAssembler } from './product-assembler';
import { CreateProductRequest } from './product.request';

const labEndpointUrl = `${environment.serverBasePath}${environment.laboratoryLabsEndpointPath}`;

export class ProductApiEndpoint extends BaseApiEndpoint<
  PharmaceuticalProduct,
  PharmaceuticalProductResource,
  PharmaceuticalProductsResponse,
  ProductAssembler
> {
  constructor(http: HttpClient) {
    super(http, labEndpointUrl, new ProductAssembler());
  }

  getProductsByLab(labId: string): Observable<PharmaceuticalProduct[]> {
    return this.http
      .get<PharmaceuticalProductsResponse>(`${this.endpointUrl}/${labId}/products`)
      .pipe(
        map((response) => this.assembler.toEntitiesFromResponse(response)),
        catchError(this.handleError(`Failed to fetch products for lab ${labId}`)),
      );
  }

  createProduct(labId: string, request: CreateProductRequest): Observable<PharmaceuticalProduct> {
    return this.http
      .post<PharmaceuticalProductResource>(`${this.endpointUrl}/${labId}/products`, request)
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to create pharmaceutical product')),
      );
  }
}
