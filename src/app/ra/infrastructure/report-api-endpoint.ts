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
 * This endpoint encapsulates all HTTP communication related to generating
 * document reports (PDF, CSV) within the Reporting and Analysis (RA) domain.
 * It handles requests for production batches, compliance audits, and equipment logs.
 *
 * Unlike standard API endpoints that return JSON resources, these methods
 * configure the HttpClient to expect binary data streams (`Blob`) representing
 * the generated files.
 */
export class ReportApiEndpoint {
  /**
   * Creates an instance of ReportApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests
   */
  constructor(private http: HttpClient) {}

  /**
   * Requests the generation of a production batch report.
   *
   * @param request - The DTO containing batch selection and format preferences
   * @returns Observable stream emitting the generated report as a binary Blob
   *
   * @remarks
   * Sends a POST request to trigger the server-side assembly of batch telemetry
   * and deviations into the requested file format.
   */
  generateBatchReport(request: GenerateBatchReportRequest): Observable<Blob> {
    return this.http
      .post(`${reportEndpointUrl}/batch`, request, { responseType: 'blob' })
      .pipe(
        catchError((err) =>
          throwError(() => new Error('Failed to generate batch report', { cause: err })),
        ),
      );
  }

  /**
   * Requests the generation of a regulatory compliance audit report.
   *
   * @param request - The DTO containing lab selection, date ranges, and format preferences
   * @returns Observable stream emitting the generated audit report as a binary Blob
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
   * @param request - The DTO containing equipment selection, date ranges, and format preferences
   * @returns Observable stream emitting the exported logs as a binary Blob
   */
  exportEquipmentLog(request: ExportEquipmentLogRequest): Observable<Blob> {
    return this.http
      .post(`${reportEndpointUrl}/equipment-log`, request, { responseType: 'blob' })
      .pipe(
        catchError((err) =>
          throwError(() => new Error('Failed to export equipment log', { cause: err })),
        ),
      );
  }
}
