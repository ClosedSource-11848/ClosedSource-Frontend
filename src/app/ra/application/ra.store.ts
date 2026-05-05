import { Injectable, signal, computed, inject } from '@angular/core';
import { retry } from 'rxjs';
import { RaApi } from '../infrastructure/ra-api';

import { KpiDashboard } from '../domain/model/kpi-dashboard.entity';
import { DeviationTrend } from '../domain/model/deviation-trend.entity';
import { AuditLogEntry } from '../domain/model/audit-log-entry.entity';

import { GenerateBatchReportCommand } from '../domain/model/generate-batch-report.command';
import { GenerateComplianceReportCommand } from '../domain/model/generate-compliance-report.command';
import { ExportEquipmentLogCommand } from '../domain/model/export-equipment-log.command';

@Injectable({ providedIn: 'root' })
export class RaStore {
  private readonly api = inject(RaApi);

  // ── State ────────────────────────────────────────────────────────────────
  private readonly _dashboard = signal<KpiDashboard | null>(null);
  private readonly _deviationTrends = signal<DeviationTrend[]>([]);
  private readonly _auditLogs = signal<AuditLogEntry[]>([]);

  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _successMsg = signal<string | null>(null);

  // ── Selectors (readonly) ─────────────────────────────────────────────────
  readonly dashboard = this._dashboard.asReadonly();
  readonly deviationTrends = this._deviationTrends.asReadonly();
  readonly auditLogs = this._auditLogs.asReadonly();

  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly successMsg = this._successMsg.asReadonly();

  readonly criticalMetrics = computed(() => {
    const dash = this._dashboard();
    return dash ? dash.metrics.filter((m) => m.status === 'CRITICAL') : [];
  });

  readonly atRiskMetrics = computed(() => {
    const dash = this._dashboard();
    return dash ? dash.metrics.filter((m) => m.status === 'AT_RISK') : [];
  });

  readonly hasCriticalDeviations = computed(() => this.criticalMetrics().length > 0);

  // ── Dashboard & Metrics ──────────────────────────────────────────────────

  loadDashboard(labId: string): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .getDashboardByLab(labId)
      .pipe(retry(2))
      .subscribe({
        next: (dash: KpiDashboard) => {
          this._dashboard.set(dash);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load KPI Dashboard'));
          this._isLoading.set(false);
        },
      });
  }

  loadDeviationTrends(equipmentId: string): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .getTrendsByEquipment(equipmentId)
      .pipe(retry(2))
      .subscribe({
        next: (trends: DeviationTrend[]) => {
          this._deviationTrends.set(trends);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load deviation trends'));
          this._isLoading.set(false);
        },
      });
  }

  // ── Audit Logs ───────────────────────────────────────────────────────────

  loadAuditLog(filters?: {
    equipmentId?: string;
    batchId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api
      .getAuditLog(filters)
      .pipe(retry(2))
      .subscribe({
        next: (logs: AuditLogEntry[]) => {
          this._auditLogs.set(logs);
          this._isLoading.set(false);
        },
        error: (err: any) => {
          this._error.set(this.formatError(err, 'Failed to load audit logs'));
          this._isLoading.set(false);
        },
      });
  }

  // ── Report Generators (Blobs) ────────────────────────────────────────────

  generateBatchReport(command: GenerateBatchReportCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api.generateBatchReport(command as any).subscribe({
      next: (blob: Blob) => {
        const filename = `Batch_Report_${command.batchId}.${command.format.toLowerCase()}`;
        this.downloadFile(blob, filename);
        this._successMsg.set('Batch report downloaded successfully');
        this._isLoading.set(false);
      },
      error: (err: any) => {
        this._error.set(this.formatError(err, 'Failed to generate batch report'));
        this._isLoading.set(false);
      },
    });
  }

  generateComplianceReport(command: GenerateComplianceReportCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api.generateComplianceReport(command as any).subscribe({
      next: (blob: Blob) => {
        const filename = `Compliance_Report_${command.labId}.${command.format.toLowerCase()}`;
        this.downloadFile(blob, filename);
        this._successMsg.set('Compliance report downloaded successfully');
        this._isLoading.set(false);
      },
      error: (err: any) => {
        this._error.set(this.formatError(err, 'Failed to generate compliance report'));
        this._isLoading.set(false);
      },
    });
  }

  exportEquipmentLog(command: ExportEquipmentLogCommand): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.api.exportEquipmentLog(command as any).subscribe({
      next: (blob: Blob) => {
        const filename = `Equipment_Log_${command.equipmentId}.${command.format.toLowerCase()}`;
        this.downloadFile(blob, filename);
        this._successMsg.set('Equipment log exported successfully');
        this._isLoading.set(false);
      },
      error: (err: any) => {
        this._error.set(this.formatError(err, 'Failed to export equipment log'));
        this._isLoading.set(false);
      },
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  clearMessages(): void {
    this._error.set(null);
    this._successMsg.set(null);
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not Found`
        : error.message;
    }
    return fallback;
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();

    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }
}
