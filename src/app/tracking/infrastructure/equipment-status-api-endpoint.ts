import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { EquipmentStatus } from '../domain/model/equipment-status.entity';
import { EquipmentStatusResource, EquipmentStatusesResponse } from './equipment-status-response';
import { EquipmentStatusAssembler } from './equipment-status-assembler';

const equipmentsEndpointUrl = `${environment.serverBasePath}${environment.equipmentEndpointPath}`;

export class EquipmentStatusApiEndpoint extends BaseApiEndpoint<
  EquipmentStatus,
  EquipmentStatusResource,
  EquipmentStatusesResponse,
  EquipmentStatusAssembler
> {
  constructor(http: HttpClient) {
    super(http, equipmentsEndpointUrl, new EquipmentStatusAssembler());
  }

  getStatusByEquipment(equipmentId: number): Observable<EquipmentStatus> {
    return this.http
      .get<EquipmentStatusResource>(
        `${this.endpointUrl}/${equipmentId}${environment.equipmentTelemetryStatusEndpointPath}`,
      )
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError(
          this.handleError(`Failed to fetch telemetry status for equipment ${equipmentId}`),
        ),
      );
  }
}
