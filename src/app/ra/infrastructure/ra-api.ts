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

/**
 * Infrastructure service facade for Reporting and Analysis (RA) external API operations.
 *
 * @remarks
 * In Domain-Driven Design, this service acts as the infrastructure layer facade
 * coordinating access to RA-related API resources through HTTP endpoints.
 * It orchestrates interactions between the application layer and the underlying
 * infrastructure endpoints for KPIs, trends, audit logs, and reports.
 *
 * The RaApi abstracts away the complexity of managing multiple endpoints,
 * providing a unified interface for application services to interact with
 * the reporting domain data.
 */
@Injectable({ providedIn: 'root' })
export class RaApi extends BaseApi {
  private readonly _kpiEndpoint: KpiApiEndpoint;
  private readonly _deviationTrendEndpoint: DeviationTrendApiEndpoint;
  private readonly _auditLogEndpoint: AuditLogApiEndpoint;
  private readonly _reportEndpoint: ReportApiEndpoint;

  /**
   * Creates an instance of RaApi.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the API facade with specialized endpoint clients for KPIs,
   * trends, audit logs, and document reporting. Each client manages its own
   * HTTP configuration and resource conversion.
   */
  constructor(http: HttpClient) {
    super();
    this._kpiEndpoint = new KpiApiEndpoint(http);
    this._deviationTrendEndpoint = new DeviationTrendApiEndpoint(http);
    this._auditLogEndpoint = new AuditLogApiEndpoint(http);
    this._reportEndpoint = new ReportApiEndpoint(http);
  }

  // ── KPI Dashboard ────────────────────────────────────────────────────────

  /**
   * Retrieves the current KPI dashboard snapshot for a specific laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory
   * @returns Observable stream emitting the KpiDashboard domain entity
   */
  getDashboardByLab(labId: number): Observable<KpiDashboard> {
    return this._kpiEndpoint.getDashboardByLab(labId);
  }

  // ── Deviation Trends ─────────────────────────────────────────────────────

  /**
   * Retrieves historical deviation trends for a specific piece of equipment.
   *
   * @param equipmentId - The unique numeric identifier of the equipment
   * @returns Observable stream emitting an array of DeviationTrend domain entities
   */
  getTrendsByEquipment(equipmentId: number): Observable<DeviationTrend[]> {
    return this._deviationTrendEndpoint.getTrendsByEquipment(equipmentId);
  }

  // ── Audit Log ────────────────────────────────────────────────────────────

  /**
   * Retrieves a collection of audit log entries based on provided criteria.
   *
   * @param filters - Optional object containing query parameters to filter the audit trail
   * @param filters.equipmentId - Filter by the numeric identifier of specific equipment
   * @param filters.batchId - Filter by the numeric identifier of a production batch
   * @param filters.dateFrom - Start date for the log query (ISO string format)
   * @param filters.dateTo - End date for the log query (ISO string format)
   * @returns Observable stream emitting an array of AuditLogEntry domain entities
   */
  getAuditLog(filters?: {
    equipmentId?: number;
    batchId?: number;
    dateFrom?: string;
    dateTo?: string;
  }): Observable<AuditLogEntry[]> {
    return this._auditLogEndpoint.getAuditLog(filters);
  }

  // ── Reports (Returns Blobs for PDF/CSV) ──────────────────────────────────

  /**
   * Requests the generation of a production batch report.
   *
   * @param request - The DTO containing batch selection and format preferences
   * @returns Observable stream emitting the generated report as a binary Blob
   */
  generateBatchReport(request: GenerateBatchReportRequest): Observable<Blob> {
    return this._reportEndpoint.generateBatchReport(request);
  }

  /**
   * Requests the generation of a regulatory compliance audit report.
   *
   * @param request - The DTO containing lab selection, date ranges, and format preferences
   * @returns Observable stream emitting the generated audit report as a binary Blob
   */
  generateComplianceReport(request: GenerateComplianceReportRequest): Observable<Blob> {
    return this._reportEndpoint.generateComplianceReport(request);
  }

  /**
   * Requests the export of historical equipment logs.
   *
   * @param request - The DTO containing equipment selection, date ranges, and format preferences
   * @returns Observable stream emitting the exported logs as a binary Blob
   */
  exportEquipmentLog(request: ExportEquipmentLogRequest): Observable<Blob> {
    return this._reportEndpoint.exportEquipmentLog(request);
  }
}
