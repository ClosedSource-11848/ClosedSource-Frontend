import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  GenerateBatchReportRequest,
  GenerateBatchReportBody,
  GenerateComplianceReportRequest,
  GenerateComplianceReportBody,
  ExportEquipmentLogRequest,
  ExportEquipmentLogBody,
} from './report.request';

const batchesEndpointUrl = `${environment.serverBasePath}${environment.batchEndpointPath}`;
const laboratoriesEndpointUrl = `${environment.serverBasePath}${environment.laboratoryLabsEndpointPath}`;
const equipmentsEndpointUrl = `${environment.serverBasePath}${environment.equipmentEndpointPath}`;

export class ReportApiEndpoint {
  constructor(private readonly http: HttpClient) {}

  generateBatchReport(request: GenerateBatchReportRequest): Observable<Blob> {
    const body: GenerateBatchReportBody = {
      includeTelemetry: request.includeTelemetry,
      includeDeviations: request.includeDeviations,
      format: request.format,
      requestedBy: request.requestedBy,
    };

    return this.http
      .post(
        `${batchesEndpointUrl}/${request.batchId}${environment.batchReportsEndpointPath}`,
        body,
        { responseType: 'blob' },
      )
      .pipe(
        catchError((err) =>
          throwError(() => new Error('Failed to generate batch report', { cause: err })),
        ),
      );
  }

  generateComplianceReport(request: GenerateComplianceReportRequest): Observable<Blob> {
    const body: GenerateComplianceReportBody = {
      startDate: request.startDate,
      endDate: request.endDate,
      format: request.format,
      requestedBy: request.requestedBy,
    };

    return this.http
      .post(
        `${laboratoriesEndpointUrl}/${request.laboratoryId}${environment.raComplianceReportsEndpointPath}`,
        body,
        { responseType: 'blob' },
      )
      .pipe(
        catchError((err) =>
          throwError(() => new Error('Failed to generate compliance report', { cause: err })),
        ),
      );
  }

  exportEquipmentLog(request: ExportEquipmentLogRequest): Observable<Blob> {
    const body: ExportEquipmentLogBody = {
      startDate: request.startDate,
      endDate: request.endDate,
      format: request.format,
      requestedBy: request.requestedBy,
    };

    return this.http
      .post(
        `${equipmentsEndpointUrl}/${request.equipmentId}${environment.equipmentLogReportsEndpointPath}`,
        body,
        { responseType: 'blob' },
      )
      .pipe(
        catchError((err) =>
          throwError(() => new Error('Failed to export equipment log', { cause: err })),
        ),
      );
  }
}
