import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  GenerateBatchReportRequest,
  GenerateComplianceReportRequest,
  ExportEquipmentLogRequest,
} from './report.request';

const reportEndpointUrl = `${environment.serverBasePath}${environment.raReportsEndpointPath}`;

export class ReportApiEndpoint {
  constructor(private http: HttpClient) {}

  generateBatchReport(request: GenerateBatchReportRequest): Observable<Blob> {
    return this.http
      .post(`${reportEndpointUrl}/batch`, request, { responseType: 'blob' })
      .pipe(
        catchError((err) => throwError(() => new Error('Failed to generate batch report', err))),
      );
  }

  generateComplianceReport(request: GenerateComplianceReportRequest): Observable<Blob> {
    return this.http
      .post(`${reportEndpointUrl}/compliance`, request, { responseType: 'blob' })
      .pipe(
        catchError((err) =>
          throwError(() => new Error('Failed to generate compliance report', err)),
        ),
      );
  }

  exportEquipmentLog(request: ExportEquipmentLogRequest): Observable<Blob> {
    return this.http
      .post(`${reportEndpointUrl}/equipment-log`, request, { responseType: 'blob' })
      .pipe(
        catchError((err) => throwError(() => new Error('Failed to export equipment log', err))),
      );
  }
}
