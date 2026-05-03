import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { environment } from '../../../environments/environment';
import { RawMaterial } from '../domain/model/raw-material.entity';
import { RawMaterialResource } from './laboratory-response';
import { RawMaterialAssembler } from './raw-material-assembler';
import { CreateRawMaterialRequest } from './laboratory.request';

const labEndpointUrl = `${environment.apiBaseUrl}/labs`;

export class RawMaterialApiEndpoint extends BaseApiEndpoint<
  RawMaterial,
  RawMaterialResource,
  BaseResponse,
  RawMaterialAssembler
> {
  constructor(http: HttpClient) {
    super(http, labEndpointUrl, new RawMaterialAssembler());
  }

  getRawMaterialsByLab(labId: string): Observable<RawMaterial[]> {
    return this.http.get<RawMaterialResource[]>(`${this.endpointUrl}/${labId}/raw-materials`).pipe(
      map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError(`Failed to fetch raw materials for lab ${labId}`)),
    );
  }

  getLowStockMaterials(labId: string): Observable<RawMaterial[]> {
    return this.http
      .get<RawMaterialResource[]>(`${this.endpointUrl}/${labId}/raw-materials/low-stock`)
      .pipe(
        map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
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
