import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RaStore } from '../../../application/ra.store';
import { IamStore } from '../../../../iam/application/iam.store';

/**
 * Component responsible for providing a user interface to request various operational reports.
 *
 * @remarks
 * In the presentation layer, this component acts as a command dispatcher for document
 * generation. It collects user parameters (dates, target entities, export formats)
 * through template-driven forms and dispatches the corresponding commands to the
 * `RaStore` to trigger backend report generation (PDF or CSV downloads).
 */
@Component({
  selector: 'app-report-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './report-generator.html',
  styleUrl: './report-generator.css',
})
export class ReportGeneratorComponent {
  /**
   * The application store managing the state for the Reporting and Analysis (RA) domain.
   */
  protected readonly store = inject(RaStore);

  /**
   * The identity and access management store, used to retrieve the current user's context.
   */
  protected readonly iamStore = inject(IamStore);

  /**
   * Form state for generating production batch reports.
   */
  batchForm = {
    batchId: null as number | null,
    includeTelemetry: true,
    includeDeviations: true,
    format: 'PDF' as 'PDF' | 'CSV',
  };

  /**
   * Form state for generating regulatory compliance reports.
   */
  complianceForm = {
    startDate: null as Date | null,
    endDate: null as Date | null,
    format: 'PDF' as 'PDF' | 'CSV',
  };

  /**
   * Form state for exporting equipment maintenance and operational logs.
   */
  equipmentForm = {
    equipmentId: null as number | null,
    startDate: null as Date | null,
    endDate: null as Date | null,
    format: 'CSV' as 'PDF' | 'CSV',
  };

  /**
   * Retrieves the current user ID based on the authenticated context.
   * * @remarks
   * Converts the ID to a number to align with domain entity definitions.
   * Defaults to a generic system ID (e.g., 1) if no session exists.
   */
  private get currentUserId(): number {
    const id = this.iamStore.currentUserId();
    return id ? Number(id) : 1;
  }

  /**
   * Retrieves the current laboratory ID based on the authenticated user's context.
   * * @remarks
   * Converts the ID to a numeric value for domain consistency. Defaults to 1.
   */
  private get currentLabId(): number {
    const id = this.iamStore.currentUserId();
    return id ? Number(id) : 1;
  }

  // ── Actions ─────────────────────────────────────────────────────────────

  /**
   * Dispatches the command to generate a batch report using the current form values.
   */
  onGenerateBatchReport(): void {
    if (!this.batchForm.batchId) return;

    this.store.generateBatchReport({
      batchId: this.batchForm.batchId,
      includeTelemetry: this.batchForm.includeTelemetry,
      includeDeviations: this.batchForm.includeDeviations,
      format: this.batchForm.format,
      requestedBy: this.currentUserId,
    });
  }

  /**
   * Dispatches the command to generate a regulatory compliance report.
   */
  onGenerateComplianceReport(): void {
    if (!this.complianceForm.startDate || !this.complianceForm.endDate) return;

    this.store.generateComplianceReport({
      labId: this.currentLabId,
      startDate: this.complianceForm.startDate.toISOString(),
      endDate: this.complianceForm.endDate.toISOString(),
      format: this.complianceForm.format,
      requestedBy: this.currentUserId,
    });
  }

  /**
   * Dispatches the command to export the historical log of a specific piece of equipment.
   */
  onExportEquipmentLog(): void {
    if (
      !this.equipmentForm.equipmentId ||
      !this.equipmentForm.startDate ||
      !this.equipmentForm.endDate
    ) {
      return;
    }

    this.store.exportEquipmentLog({
      equipmentId: this.equipmentForm.equipmentId,
      startDate: this.equipmentForm.startDate.toISOString(),
      endDate: this.equipmentForm.endDate.toISOString(),
      format: this.equipmentForm.format,
      requestedBy: this.currentUserId,
    });
  }
}
