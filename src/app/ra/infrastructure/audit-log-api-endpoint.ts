import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { AuditLogEntry } from '../domain/model/audit-log-entry.entity';
import { AuditLogEntryResource, AuditLogEntriesResponse } from './audit-log-response';
import { AuditLogAssembler } from './audit-log-assembler';

const auditLogEndpointUrl = `${environment.serverBasePath}${environment.raAuditLogEndpointPath}`;

/**
 * HTTP endpoint client for audit log operations.
 *
 * @remarks
 * This endpoint encapsulates HTTP communication for audit log data within
 * the Reporting and Analysis bounded context.
 *
 * Endpoint contract:
 * - GET /audit-logs?equipmentId=&batchId=&dateFrom=&dateTo=
 */
export class AuditLogApiEndpoint extends BaseApiEndpoint<
  AuditLogEntry,
  AuditLogEntryResource,
  AuditLogEntriesResponse,
  AuditLogAssembler
> {
  /**
   * Creates an instance of AuditLogApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, auditLogEndpointUrl, new AuditLogAssembler());
  }

  /**
   * Retrieves audit log entries based on optional filters.
   *
   * @param filters - Optional filter criteria for the audit log query
   * @param filters.equipmentId - Filter by equipment numeric identifier
   * @param filters.batchId - Filter by production batch numeric identifier
   * @param filters.dateFrom - Start date for the audit log query
   * @param filters.dateTo - End date for the audit log query
   * @returns Observable stream emitting an array of audit log entries
   *
   * @remarks
   * Builds query parameters dynamically and expects a direct array response
   * from the backend.
   */
  getAuditLog(filters?: {
    equipmentId?: number;
    batchId?: number;
    dateFrom?: string;
    dateTo?: string;
  }): Observable<AuditLogEntry[]> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.append(key, String(value));
        }
      });
    }

    return this.http.get<AuditLogEntryResource[]>(this.endpointUrl, { params }).pipe(
      map((resources) => this.assembler.toEntitiesFromResources(resources)),
      catchError(this.handleError('Failed to fetch audit logs')),
    );
  }
}
