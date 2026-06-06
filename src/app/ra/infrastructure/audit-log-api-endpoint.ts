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
 * This endpoint encapsulates all HTTP communication for the AuditLogEntry entity
 * within the Reporting and Analysis (RA) domain. It extends {@link BaseApiEndpoint}
 * to leverage standard data access patterns with specialized filtering configuration.
 *
 * The endpoint handles retrieving historical system actions and compliance
 * events based on timeframes, related equipment, or production batches.
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
   *
   * @remarks
   * Initializes the endpoint with the configured server base path and the
   * audit log endpoint path. The AuditLogAssembler is used to map between
   * infrastructure resources and domain entities.
   */
  constructor(http: HttpClient) {
    super(http, auditLogEndpointUrl, new AuditLogAssembler());
  }

  /**
   * Retrieves a collection of audit log entries based on provided criteria.
   *
   * @param filters - Optional object containing query parameters to filter the audit trail
   * @param filters.equipmentId - Filter by the numeric identifier of specific equipment
   * @param filters.batchId - Filter by the numeric identifier of a production batch
   * @param filters.dateFrom - Start date for the log query (ISO string)
   * @param filters.dateTo - End date for the log query (ISO string)
   * @returns Observable stream emitting an array of AuditLogEntry domain entities
   *
   * @remarks
   * Constructs dynamic HTTP parameters from the provided filters and performs a GET request
   * to fetch the audit trail records.
   */
  getAuditLog(filters?: {
    equipmentId?: number;
    batchId?: number;
    dateFrom?: string;
    dateTo?: string;
  }): Observable<AuditLogEntry[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.equipmentId) params = params.set('equipmentId', filters.equipmentId.toString());
      if (filters.batchId) params = params.set('batchId', filters.batchId.toString());
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
    }

    return this.http.get<AuditLogEntriesResponse>(this.endpointUrl, { params }).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response)),
      catchError(this.handleError('Failed to fetch audit logs')),
    );
  }
}
