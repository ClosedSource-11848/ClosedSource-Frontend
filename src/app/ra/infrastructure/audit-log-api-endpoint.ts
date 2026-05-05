import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { AuditLogEntry } from '../domain/model/audit-log-entry.entity';
import { AuditLogEntryResource, AuditLogEntriesResponse } from './audit-log-response';
import { AuditLogAssembler } from './audit-log-assembler';

const auditLogEndpointUrl = `${environment.serverBasePath}${environment.raAuditLogEndpointPath}`;

export class AuditLogApiEndpoint extends BaseApiEndpoint<
  AuditLogEntry,
  AuditLogEntryResource,
  AuditLogEntriesResponse,
  AuditLogAssembler
> {
  constructor(http: HttpClient) {
    super(http, auditLogEndpointUrl, new AuditLogAssembler());
  }

  getAuditLog(filters?: {
    equipmentId?: string;
    batchId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Observable<AuditLogEntry[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.equipmentId) params = params.set('equipmentId', filters.equipmentId);
      if (filters.batchId) params = params.set('batchId', filters.batchId);
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
    }

    return this.http.get<AuditLogEntriesResponse>(this.endpointUrl, { params }).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response)),
      catchError(this.handleError('Failed to fetch audit logs')),
    );
  }
}
