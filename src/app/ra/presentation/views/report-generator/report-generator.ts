import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

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

@Component({
  selector: 'app-report-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
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
  protected readonly store = inject(RaStore);
  protected readonly iamStore = inject(IamStore);

  batchForm = {
    batchId: '',
    includeTelemetry: true,
    includeDeviations: true,
    format: 'PDF' as 'PDF' | 'CSV',
  };

  complianceForm = {
    startDate: null as Date | null,
    endDate: null as Date | null,
    format: 'PDF' as 'PDF' | 'CSV',
  };

  equipmentForm = {
    equipmentId: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    format: 'CSV' as 'PDF' | 'CSV',
  };

  private get currentUserId(): string {
    return this.iamStore.currentUserId() || 'SYSTEM';
  }

  private get currentLabId(): string {
    return 'LAB-001';
  }

  // ── Actions ─────────────────────────────────────────────────────────────

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

  onExportEquipmentLog(): void {
    if (
      !this.equipmentForm.equipmentId ||
      !this.equipmentForm.startDate ||
      !this.equipmentForm.endDate
    )
      return;

    this.store.exportEquipmentLog({
      equipmentId: this.equipmentForm.equipmentId,
      startDate: this.equipmentForm.startDate.toISOString(),
      endDate: this.equipmentForm.endDate.toISOString(),
      format: this.equipmentForm.format,
      requestedBy: this.currentUserId,
    });
  }
}
