import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { environment } from '../../../environments/environment';
import { MaintenanceRecord } from '../domain/model/maintenance-record.entity';
import { MaintenanceResource } from './equipment-response';
import { MaintenanceAssembler } from './maintenance-assembler';
import { RegisterMaintenanceRequest } from './equipment.request';

const equipmentEndpointUrl = `${environment.serverBasePath}${environment.equipmentEndpointPath}`;

export class MaintenanceApiEndpoint extends BaseApiEndpoint<
  MaintenanceRecord,
  MaintenanceResource,
  BaseResponse,
  MaintenanceAssembler
> {
  constructor(http: HttpClient) {
    super(http, equipmentEndpointUrl, new MaintenanceAssembler());
  }

  getMaintenanceHistory(equipmentId: string): Observable<MaintenanceRecord[]> {
    return this.http
      .get<MaintenanceResource[]>(`${this.endpointUrl}/${equipmentId}/maintenance`)
      .pipe(
        map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
        catchError(
          this.handleError(`Failed to fetch maintenance history for equipment ${equipmentId}`),
        ),
      );
  }

  registerMaintenance(request: RegisterMaintenanceRequest): Observable<MaintenanceRecord> {
    return this.http.post<MaintenanceResource>(`${this.endpointUrl}/maintenance`, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to register maintenance record')),
    );
  }
}
