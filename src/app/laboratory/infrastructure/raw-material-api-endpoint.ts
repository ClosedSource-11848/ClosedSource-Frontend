import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { RawMaterial } from '../domain/model/raw-material.entity';
import { RawMaterialResource, RawMaterialsResponse } from './raw-material-response';
import { RawMaterialAssembler } from './raw-material-assembler';
import { CreateRawMaterialRequest } from './raw-material.request';

const labEndpointUrl = `${environment.serverBasePath}${environment.laboratoryLabsEndpointPath}`;

export class RawMaterialApiEndpoint extends BaseApiEndpoint<
  RawMaterial,
  RawMaterialResource,
  RawMaterialsResponse,
  RawMaterialAssembler
> {
  constructor(http: HttpClient) {
    super(http, labEndpointUrl, new RawMaterialAssembler());
  }

  getRawMaterialsByLab(labId: string): Observable<RawMaterial[]> {
    return this.http.get<RawMaterialsResponse>(`${this.endpointUrl}/${labId}/raw-materials`).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response)),
      catchError(this.handleError(`Failed to fetch raw materials for lab ${labId}`)),
    );
  }

  getLowStockMaterials(labId: string): Observable<RawMaterial[]> {
    return this.http
      .get<RawMaterialsResponse>(`${this.endpointUrl}/${labId}/raw-materials/low-stock`)
      .pipe(
        map((response) => this.assembler.toEntitiesFromResponse(response)),
        catchError(this.handleError(`Failed to fetch low stock materials for lab ${labId}`)),
      );
  }

  createRawMaterial(labId: string, request: CreateRawMaterialRequest): Observable<RawMaterial> {
    return this.http
      .post<RawMaterialResource>(`${this.endpointUrl}/${labId}/raw-materials`, request)
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to create raw material')),
      );
  }
}
