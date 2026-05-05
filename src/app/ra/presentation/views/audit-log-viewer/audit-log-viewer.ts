import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RaStore } from '../../../application/ra.store';

@Component({
  selector: 'app-audit-log-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './audit-log-viewer.html',
  styleUrl: './audit-log-viewer.css',
})
export class AuditLogViewerComponent implements OnInit {
  protected readonly store = inject(RaStore);

  protected readonly displayedColumns = ['timestamp', 'action', 'entity', 'performedBy', 'details'];

  protected filters = {
    equipmentId: '',
    batchId: '',
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
  };

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    const query: any = {};
    if (this.filters.equipmentId) query.equipmentId = this.filters.equipmentId;
    if (this.filters.batchId) query.batchId = this.filters.batchId;
    if (this.filters.dateFrom) query.dateFrom = this.filters.dateFrom.toISOString();
    if (this.filters.dateTo) query.dateTo = this.filters.dateTo.toISOString();

    const hasFilters = Object.keys(query).length > 0;
    this.store.loadAuditLog(hasFilters ? query : undefined);
  }

  clearFilters(): void {
    this.filters = {
      equipmentId: '',
      batchId: '',
      dateFrom: null,
      dateTo: null,
    };
    this.loadLogs();
  }

  getActionBadgeClass(action: string): string {
    const act = action.toUpperCase();
    if (act.includes('CREATE') || act.includes('REGISTER')) return 'badge-create';
    if (act.includes('UPDATE') || act.includes('EDIT')) return 'badge-update';
    if (act.includes('DELETE') || act.includes('REMOVE')) return 'badge-delete';
    if (act.includes('RELEASE') || act.includes('APPROVE')) return 'badge-success';
    if (act.includes('REJECT')) return 'badge-danger';
    return 'badge-default';
  }
}
