import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { environment } from '../../../environments/environment';
import { Laboratory } from '../domain/model/laboratory.entity';
import { LaboratoryResource } from './laboratory-response';
import { LaboratoryAssembler } from './laboratory-assembler';
import { UpdateLaboratoryRequest } from './laboratory.request';

const labEndpointUrl = `${environment.serverBasePath}${environment.laboratoryLabsEndpointPath}`;

export class LaboratoryApiEndpoint extends BaseApiEndpoint<
  Laboratory,
  LaboratoryResource,
  BaseResponse,
  LaboratoryAssembler
> {
  constructor(http: HttpClient) {
    super(http, labEndpointUrl, new LaboratoryAssembler());
  }

  getByLabId(labId: string): Observable<Laboratory> {
    return this.http.get<LaboratoryResource>(`${this.endpointUrl}/${labId}`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to fetch laboratory ${labId}`)),
    );
  }

  updateLaboratory(labId: string, request: UpdateLaboratoryRequest): Observable<Laboratory> {
    return this.http.put<LaboratoryResource>(`${this.endpointUrl}/${labId}`, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to update laboratory ${labId}`)),
    );
  }
}
