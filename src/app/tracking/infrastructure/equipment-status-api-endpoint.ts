import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { EquipmentStatus } from '../domain/model/equipment-status.entity';
import { EquipmentStatusResource, EquipmentStatusesResponse } from './equipment-status-response';
import { EquipmentStatusAssembler } from './equipment-status-assembler';

const equipmentStatusEndpointUrl = `${environment.serverBasePath}${environment.trackingTelemetryEndpointPath}/status`;

/**
 * HTTP endpoint client for equipment telemetry status operations.
 *
 * @remarks
 * This endpoint handles retrieval of the current telemetry health state for
 * equipment monitored by the Tracking bounded context.
 */
export class EquipmentStatusApiEndpoint extends BaseApiEndpoint<
  EquipmentStatus,
  EquipmentStatusResource,
  EquipmentStatusesResponse,
  EquipmentStatusAssembler
> {
  /**
   * Creates a new EquipmentStatusApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, equipmentStatusEndpointUrl, new EquipmentStatusAssembler());
  }

  /**
   * Retrieves the current telemetry status for a specific equipment.
   *
   * @param equipmentId - Numeric identifier of the equipment
   * @returns Observable stream emitting an EquipmentStatus domain entity
   *
   * @remarks
   * This maps to `GET /telemetry/status/{equipmentId}`.
   */
  getStatusByEquipment(equipmentId: number): Observable<EquipmentStatus> {
    return this.http.get<EquipmentStatusResource>(`${this.endpointUrl}/${equipmentId}`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to fetch telemetry status for equipment ${equipmentId}`)),
    );
  }
}
