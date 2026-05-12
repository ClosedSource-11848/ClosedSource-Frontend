import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { MaintenanceRecord } from '../domain/model/maintenance-record.entity';
import { MaintenanceResource, MaintenancesResponse } from './maintenance-response';
import { MaintenanceAssembler } from './maintenance-assembler';
import { RegisterMaintenanceRequest } from './maintenance.request';

/**
 * The base endpoint URL used to access equipment-related API resources.
 *
 * @remarks
 * This URL is built using the server base path and the equipment endpoint path
 * defined in the application environment configuration.
 */
const equipmentEndpointUrl = `${environment.serverBasePath}${environment.equipmentEndpointPath}`;

/**
 * API endpoint responsible for maintenance-related HTTP operations.
 *
 * @remarks
 * This class provides infrastructure-level operations for retrieving the
 * maintenance history of an equipment and registering new maintenance records.
 *
 * It extends BaseApiEndpoint to reuse common HTTP behavior, endpoint
 * configuration, error handling, and transformation logic through an assembler.
 *
 * The endpoint communicates with the backend API using MaintenanceResource and
 * MaintenancesResponse structures, while exposing MaintenanceRecord domain
 * entities to the rest of the application.
 *
 * @example
 * ```typescript
 * const endpoint = new MaintenanceApiEndpoint(httpClient);
 *
 * endpoint.getMaintenanceHistory('equipment-001').subscribe((records) => {
 *   console.log(records);
 * });
 *
 * endpoint.registerMaintenance({
 *   equipmentId: 'equipment-001',
 *   maintenanceDate: '2026-05-12',
 *   technicianName: 'John Doe',
 *   description: 'Preventive maintenance and calibration performed.',
 *   type: 'PREVENTIVE'
 * }).subscribe((record) => {
 *   console.log(record);
 * });
 * ```
 */
export class MaintenanceApiEndpoint extends BaseApiEndpoint<
  MaintenanceRecord,
  MaintenanceResource,
  MaintenancesResponse,
  MaintenanceAssembler
> {
  /**
   * Creates a new MaintenanceApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to execute HTTP requests.
   *
   * @remarks
   * The constructor initializes the base API endpoint with the HTTP client,
   * the equipment endpoint URL, and a MaintenanceAssembler instance.
   */
  constructor(http: HttpClient) {
    super(http, equipmentEndpointUrl, new MaintenanceAssembler());
  }

  /**
   * Retrieves the maintenance history of a specific equipment.
   *
   * @param equipmentId - The unique identifier of the equipment.
   * @returns An Observable containing a list of MaintenanceRecord domain entities.
   *
   * @remarks
   * This method sends a GET request to retrieve all maintenance records
   * associated with the provided equipment identifier.
   *
   * The API response is transformed into domain entities using the assembler.
   * If the request fails, the inherited handleError method manages the error.
   */
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

  /**
   * Registers a new maintenance record for an equipment.
   *
   * @param request - The request data required to register the maintenance record.
   * @returns An Observable containing the created MaintenanceRecord domain entity.
   *
   * @remarks
   * This method sends a POST request with the maintenance registration data.
   * The returned API resource is converted into a MaintenanceRecord domain
   * entity using the assembler.
   *
   * If the registration request fails, the inherited handleError method
   * manages the error.
   */
  registerMaintenance(request: RegisterMaintenanceRequest): Observable<MaintenanceRecord> {
    return this.http.post<MaintenanceResource>(`${this.endpointUrl}/maintenance`, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to register maintenance record')),
    );
  }
}
