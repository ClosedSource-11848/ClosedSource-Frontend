import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { environment } from '../../../environments/environment';
import { Equipment } from '../domain/model/equipment.entity';
import { EquipmentResource } from './equipment-response';
import { EquipmentAssembler } from './equipment-assembler';
import { RegisterEquipmentRequest } from './equipment.request';

const equipmentEndpointUrl = `${environment.serverBasePath}${environment.equipmentEndpointPath}`;

export class EquipmentApiEndpoint extends BaseApiEndpoint<
  Equipment,
  EquipmentResource,
  BaseResponse,
  EquipmentAssembler
> {
  constructor(http: HttpClient) {
    super(http, equipmentEndpointUrl, new EquipmentAssembler());
  }

  getEquipmentByLab(labId: string): Observable<Equipment[]> {
    return this.http.get<EquipmentResource[]>(`${this.endpointUrl}/lab/${labId}`).pipe(
      map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError(`Failed to fetch equipment for lab ${labId}`)),
    );
  }

  registerEquipment(request: RegisterEquipmentRequest): Observable<Equipment> {
    return this.http.post<EquipmentResource>(this.endpointUrl, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to register equipment')),
    );
  }
}
