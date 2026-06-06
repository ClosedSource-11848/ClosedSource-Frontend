import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { EquipmentStatus } from '../domain/model/equipment-status.entity';
import { EquipmentStatusResource, EquipmentStatusesResponse } from './equipment-status-response';
import { EquipmentStatusAssembler } from './equipment-status-assembler';

const endpointUrl = `${environment.serverBasePath}${environment.trackingTelemetryEndpointPath}/status`;

/**
 * HTTP endpoint client for equipment telemetry status operations.
 *
 * @remarks
 * This endpoint encapsulates all HTTP communication for the EquipmentStatus entity
 * within the Tracking and Telemetry domain. It extends {@link BaseApiEndpoint}
 * to leverage standard data access patterns.
 *
 * The endpoint handles retrieving real-time operational health and connectivity
 * states for specific laboratory assets.
 */
export class EquipmentStatusApiEndpoint extends BaseApiEndpoint<
  EquipmentStatus,
  EquipmentStatusResource,
  EquipmentStatusesResponse,
  EquipmentStatusAssembler
> {
  /**
   * Creates an instance of EquipmentStatusApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the endpoint with the configured server base path and the
   * telemetry status endpoint path. The EquipmentStatusAssembler is used to map
   * between infrastructure resources and domain entities.
   */
  constructor(http: HttpClient) {
    super(http, endpointUrl, new EquipmentStatusAssembler());
  }

  /**
   * Retrieves the real-time operational status for a specific piece of equipment.
   *
   * @param equipmentId - The unique numeric identifier of the equipment
   * @returns Observable stream emitting the EquipmentStatus domain entity
   *
   * @remarks
   * Performs a GET request to fetch the latest connectivity state (online/offline)
   * and evaluated telemetry health (OPERATIONAL, WARNING, CRITICAL, etc.) for a given asset.
   */
  getStatusByEquipment(equipmentId: number): Observable<EquipmentStatus> {
    return this.http.get<EquipmentStatusResource>(`${this.endpointUrl}/${equipmentId}`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to fetch status for equipment ${equipmentId}`)),
    );
  }
}
