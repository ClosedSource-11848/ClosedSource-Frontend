import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { TrackingStore } from '../../../application/tracking.store';
import { EquipmentStore } from '../../../../equipment/application/equipment.store';
import { IamStore } from '../../../../iam/application/iam.store';

/**
 * Component responsible for displaying historical telemetry data in a tabular format.
 *
 * @remarks
 * In the presentation layer, this component provides a detailed data grid view of
 * equipment sensor readings over time. It allows users to filter the time-series
 * data by specific date ranges and highlights recorded anomalies or threshold deviations.
 */
@Component({
  selector: 'app-telemetry-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  templateUrl: './telemetry-history.html',
  styleUrl: './telemetry-history.css',
})
export class TelemetryHistoryComponent implements OnInit {
  /**
   * The application store managing the state for the Tracking and Telemetry domain.
   */
  protected readonly store = inject(TrackingStore);

  /**
   * The application store managing the state for the Equipment domain.
   */
  protected readonly equipmentStore = inject(EquipmentStore);

  /**
   * The identity and access management store, used to retrieve user context.
   */
  protected readonly iamStore = inject(IamStore);

  /**
   * Configuration for the columns displayed in the Material data table.
   */
  protected readonly displayedColumns = ['timestamp', 'parameterName', 'recordedValue', 'status'];

  // ── Filters ──────────────────────────────────────────────────────────────

  /**
   * Current filter state for querying historical telemetry records.
   * Uses numeric types for IDs to maintain domain entity consistency.
   */
  protected filters = {
    equipmentId: null as number | null,
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
  };

  /**
   * Retrieves the current laboratory ID based on the authenticated user's context.
   *
   * @remarks
   * Converts the ID to a numeric value for domain consistency. Defaults to 1.
   */
  private get currentLabId(): number {
    const id = this.iamStore.currentUserId();
    return id ? Number(id) : 1;
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────

  /**
   * Lifecycle hook that initializes the component.
   *
   * @remarks
   * Initiates the load of available equipment for the dropdown filters. Uses a
   * polling interval to wait for the equipment list to populate, automatically
   * selecting the first item to display immediate data to the user.
   */
  ngOnInit(): void {
    this.equipmentStore.loadEquipment(this.currentLabId);

    const checkEquipment = setInterval(() => {
      const list = this.equipmentStore.equipmentList();
      if (list.length > 0) {
        this.filters.equipmentId = list[0].id;
        this.loadHistoryData();
        clearInterval(checkEquipment);
      }
    }, 500);
  }

  /**
   * Constructs the query payload based on the current filter state and dispatches
   * the load command to the TrackingStore.
   */
  loadHistoryData(): void {
    if (!this.filters.equipmentId) return;

    const query: { equipmentId: number; from?: string; to?: string } = {
      equipmentId: this.filters.equipmentId,
    };

    if (this.filters.dateFrom) query.from = this.filters.dateFrom.toISOString();
    if (this.filters.dateTo) query.to = this.filters.dateTo.toISOString();

    this.store.loadTelemetryHistory(query);
  }

  /**
   * Resets the date range filters to their default empty states and reloads
   * the complete history log for the currently selected equipment.
   */
  clearFilters(): void {
    this.filters.dateFrom = null;
    this.filters.dateTo = null;
    this.loadHistoryData();
  }
}
