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

/**
 * Component responsible for displaying and filtering the system audit log.
 *
 * @remarks
 * In the presentation layer, this component provides the user interface for
 * querying historical system actions for compliance and traceability purposes.
 * It interacts with the `RaStore` to fetch filtered records based on equipment,
 * production batches, or specific timeframes.
 */
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
  /**
   * The application store managing the state for the Reporting and Analysis (RA) domain.
   */
  protected readonly store = inject(RaStore);

  /**
   * Configuration for the columns displayed in the audit log data table.
   */
  protected readonly displayedColumns = ['timestamp', 'action', 'entity', 'performedBy', 'details'];

  /**
   * Current filter state for querying audit logs.
   *
   * @remarks
   * Maintains the binding for the template-driven filter form. Uses numeric types
   * for entity IDs to maintain consistency with the domain model.
   */
  protected filters = {
    equipmentId: null as number | null,
    batchId: null as number | null,
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
  };

  /**
   * Lifecycle hook that initializes the component by loading the initial, unfiltered logs.
   */
  ngOnInit(): void {
    this.loadLogs();
  }

  /**
   * Constructs the query payload based on the current filter state and dispatches
   * the load command to the store.
   */
  loadLogs(): void {
    const query: {
      equipmentId?: number;
      batchId?: number;
      dateFrom?: string;
      dateTo?: string;
    } = {};

    if (this.filters.equipmentId) query.equipmentId = this.filters.equipmentId;
    if (this.filters.batchId) query.batchId = this.filters.batchId;
    if (this.filters.dateFrom) query.dateFrom = this.filters.dateFrom.toISOString();
    if (this.filters.dateTo) query.dateTo = this.filters.dateTo.toISOString();

    const hasFilters = Object.keys(query).length > 0;
    this.store.loadAuditLog(hasFilters ? query : undefined);
  }

  /**
   * Resets the filter form to its default empty state and reloads the complete audit log.
   */
  clearFilters(): void {
    this.filters = {
      equipmentId: null,
      batchId: null,
      dateFrom: null,
      dateTo: null,
    };
    this.loadLogs();
  }

  /**
   * Resolves a CSS class for semantic coloring based on the type of audit action.
   *
   * @param action - The string representation of the action performed
   * @returns The name of the CSS class to apply for the badge
   */
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
