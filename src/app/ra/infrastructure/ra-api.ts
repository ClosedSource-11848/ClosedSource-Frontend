import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';

import { KpiDashboard } from '../domain/model/kpi-dashboard.entity';
import { DeviationTrend } from '../domain/model/deviation-trend.entity';
import { AuditLogEntry } from '../domain/model/audit-log-entry.entity';

import { KpiApiEndpoint } from './kpi-api-endpoint';
import { DeviationTrendApiEndpoint } from './deviation-trend-api-endpoint';
import { AuditLogApiEndpoint } from './audit-log-api-endpoint';
import { ReportApiEndpoint } from './report-api-endpoint';

import {
  GenerateBatchReportRequest,
  GenerateComplianceReportRequest,
  ExportEquipmentLogRequest,
} from './report.request';

@Injectable({ providedIn: 'root' })
export class RaApi extends BaseApi {
  private readonly _kpiEndpoint: KpiApiEndpoint;
  private readonly _deviationTrendEndpoint: DeviationTrendApiEndpoint;
  private readonly _auditLogEndpoint: AuditLogApiEndpoint;
  private readonly _reportEndpoint: ReportApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this._kpiEndpoint = new KpiApiEndpoint(http);
    this._deviationTrendEndpoint = new DeviationTrendApiEndpoint(http);
    this._auditLogEndpoint = new AuditLogApiEndpoint(http);
    this._reportEndpoint = new ReportApiEndpoint(http);
  }

  // ── KPI Dashboard ────────────────────────────────────────────────────────
  getDashboardByLab(labId: string): Observable<KpiDashboard> {
    return this._kpiEndpoint.getDashboardByLab(labId);
  }

  // ── Deviation Trends ─────────────────────────────────────────────────────
  getTrendsByEquipment(equipmentId: string): Observable<DeviationTrend[]> {
    return this._deviationTrendEndpoint.getTrendsByEquipment(equipmentId);
  }

  // ── Audit Log ────────────────────────────────────────────────────────────
  getAuditLog(filters?: {
    equipmentId?: string;
    batchId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Observable<AuditLogEntry[]> {
    return this._auditLogEndpoint.getAuditLog(filters);
  }

  // ── Reports (Returns Blobs for PDF/CSV) ──────────────────────────────────
  generateBatchReport(request: GenerateBatchReportRequest): Observable<Blob> {
    return this._reportEndpoint.generateBatchReport(request);
  }

  generateComplianceReport(request: GenerateComplianceReportRequest): Observable<Blob> {
    return this._reportEndpoint.generateComplianceReport(request);
  }

  exportEquipmentLog(request: ExportEquipmentLogRequest): Observable<Blob> {
    return this._reportEndpoint.exportEquipmentLog(request);
  }
}
