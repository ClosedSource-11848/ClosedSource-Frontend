import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  GenerateBatchReportRequest,
  GenerateComplianceReportRequest,
  ExportEquipmentLogRequest,
} from './report.request';

const reportEndpointUrl = `${environment.serverBasePath}${environment.raReportsEndpointPath}`;

/**
 * HTTP endpoint client for report generation and export operations.
 *
 * @remarks
 * This endpoint encapsulates HTTP communication for binary report generation
 * within the Reporting and Analysis bounded context.
 *
 * Endpoint contract:
 * - POST /reports/batches
 * - POST /reports/compliance
 * - POST /reports/equipment-logs
 */
export class ReportApiEndpoint {
  /**
   * Creates an instance of ReportApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Requests the generation of a production batch report.
   *
   * @param request - DTO containing batch report generation parameters
   * @returns Observable stream emitting the generated report as a Blob
   */
  generateBatchReport(request: GenerateBatchReportRequest): Observable<Blob> {
    return this.http
      .post(`${reportEndpointUrl}/batches`, request, { responseType: 'blob' })
      .pipe(
        catchError((err) =>
          throwError(() => new Error('Failed to generate batch report', { cause: err })),
        ),
      );
  }

  /**
   * Requests the generation of a regulatory compliance report.
   *
   * @param request - DTO containing compliance report generation parameters
   * @returns Observable stream emitting the generated report as a Blob
   */
  generateComplianceReport(request: GenerateComplianceReportRequest): Observable<Blob> {
    return this.http
      .post(`${reportEndpointUrl}/compliance`, request, { responseType: 'blob' })
      .pipe(
        catchError((err) =>
          throwError(() => new Error('Failed to generate compliance report', { cause: err })),
        ),
      );
  }

  /**
   * Requests the export of historical equipment logs.
   *
   * @param request - DTO containing equipment log export parameters
   * @returns Observable stream emitting the exported logs as a Blob
   */
  exportEquipmentLog(request: ExportEquipmentLogRequest): Observable<Blob> {
    return this.http
      .post(`${reportEndpointUrl}/equipment-logs`, request, { responseType: 'blob' })
      .pipe(
        catchError((err) =>
          throwError(() => new Error('Failed to export equipment log', { cause: err })),
        ),
      );
  }
}
