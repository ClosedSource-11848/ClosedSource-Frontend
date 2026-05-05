import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { MaintenanceRecord } from '../domain/model/maintenance-record.entity';
import { MaintenanceResource, MaintenancesResponse } from './maintenance-response';
import { MaintenanceAssembler } from './maintenance-assembler';
import { RegisterMaintenanceRequest } from './maintenance.request';

const equipmentEndpointUrl = `${environment.serverBasePath}${environment.equipmentEndpointPath}`;

export class MaintenanceApiEndpoint extends BaseApiEndpoint<
  MaintenanceRecord,
  MaintenanceResource,
  MaintenancesResponse,
  MaintenanceAssembler
> {
  constructor(http: HttpClient) {
    super(http, equipmentEndpointUrl, new MaintenanceAssembler());
  }

  getMaintenanceHistory(equipmentId: string): Observable<MaintenanceRecord[]> {
    return this.http
      .get<MaintenancesResponse>(`${this.endpointUrl}/${equipmentId}/maintenance`)
      .pipe(
        map((response) => this.assembler.toEntitiesFromResponse(response)),
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
