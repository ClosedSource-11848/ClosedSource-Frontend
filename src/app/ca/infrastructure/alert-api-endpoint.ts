import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { AlertSeverity, AlertStatus, DeviationAlert } from '../domain/model/deviation-alert.entity';
import { AlertResource, AlertsResponse } from './alert-response';
import { AlertAssembler } from './alert-assembler';

const alertsEndpointUrl = `${environment.serverBasePath}${environment.caAlertsEndpointPath}`;

/**
 * HTTP endpoint client for deviation alert operations.
 *
 * @remarks
 * This endpoint encapsulates all HTTP communication for the DeviationAlert aggregate
 * within the Manufacturing/Quality domain. It extends {@link BaseApiEndpoint} to
 * leverage standard data access patterns with alert-specific configuration.
 *
 * The endpoint handles:
 * - GET /alerts - Retrieve deviation alerts with optional specialized filtering
 * - GET /alerts/{alertId} - Retrieve one deviation alert by ID
 * - Resource conversion from API resources to {@link DeviationAlert} domain entities
 *
 * Data transformation is delegated to the {@link AlertAssembler}.
 */
export class AlertApiEndpoint extends BaseApiEndpoint<
  DeviationAlert,
  AlertResource,
  AlertsResponse,
  AlertAssembler
> {
  /**
   * Creates an instance of AlertApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the endpoint with the server base path and the alerts-specific path.
   * The AlertAssembler is injected to manage the mapping between the infrastructure
   * resources and the domain layer entities.
   */
  constructor(http: HttpClient) {
    super(http, alertsEndpointUrl, new AlertAssembler());
  }

  /**
   * Retrieves a collection of deviation alerts based on provided criteria.
   *
   * @param filters - Optional object containing query parameters to filter results
   * @param filters.equipmentId - Filter by the specific numeric equipment source
   * @param filters.batchId - Filter by a numeric production batch identifier
   * @param filters.status - Filter by the current lifecycle state of the alert
   * @param filters.severity - Filter by the impact level of the deviation
   *
   * @returns An Observable of {@link DeviationAlert} array
   *
   * @remarks
   * This method constructs dynamic query parameters and performs a GET request.
   * It expects a direct array response from the backend, matching the current
   * bounded context API style used by laboratory, equipment, and batch.
   */
  getAlerts(filters?: {
    equipmentId?: number;
    batchId?: number;
    status?: AlertStatus;
    severity?: AlertSeverity;
  }): Observable<DeviationAlert[]> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.append(key, String(value));
        }
      });
    }

    return this.http.get<AlertResource[]>(this.endpointUrl, { params }).pipe(
      map((resources) => this.assembler.toEntitiesFromResources(resources)),
      catchError(this.handleError('Failed to fetch deviation alerts')),
    );
  }

  /**
   * Retrieves a single deviation alert by its unique numeric identifier.
   *
   * @param alertId - The unique numeric identifier of the deviation alert
   * @returns An Observable of {@link DeviationAlert}
   */
  getAlertById(alertId: number): Observable<DeviationAlert> {
    return this.http.get<AlertResource>(`${this.endpointUrl}/${alertId}`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to fetch deviation alert ${alertId}`)),
    );
  }
}
