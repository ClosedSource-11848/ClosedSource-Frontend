import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

import { TrackingStore } from '../../../application/tracking.store';
import { EquipmentStore } from '../../../../equipment/application/equipment.store';
import { IamStore } from '../../../../iam/application/iam.store';

/**
 * Component responsible for providing detailed analytical charts for telemetry data.
 *
 * @remarks
 * In the presentation layer, this component allows users to perform deeper historical
 * analysis of equipment telemetry. It features time-based filtering and advanced
 * visual indicators (like highlighting line segments that connect to anomalous data points).
 */
@Component({
  selector: 'app-telemetry-chart',
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
    BaseChartDirective,
  ],
  templateUrl: './telemetry-chart.html',
  styleUrl: './telemetry-chart.css',
})
export class TelemetryChartComponent implements OnInit {
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
   * Service for handling internationalization and translation lookups.
   */
  private readonly translate = inject(TranslateService);

  // ── Analytical Filters ───────────────────────────────────────────────────

  /**
   * Current filter state for querying historical telemetry data.
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

  // ── Chart.js Configuration ───────────────────────────────────────────────

  /**
   * Advanced configuration options for the analytical Chart.js line chart.
   * Features custom tooltips and nearest-neighbor interaction modes for better UX.
   */
  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) =>
            `${this.translate.instant('tracking.analysis.value')}: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: false },
    },
    elements: {
      point: { radius: 3, hoverRadius: 6 },
      line: { tension: 0.3, borderWidth: 2 },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  /**
   * Reactive computed signal that transforms historical telemetry points into
   * a sophisticated analytical chart structure.
   *
   * @remarks
   * Sorts history chronologically, formats dates for X-axis readability, and dynamically
   * colors both data points and the line segments connecting them. If a segment connects
   * to a recorded anomaly, the line turns red to immediately draw the analyst's attention.
   */
  public chartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const history = this.store.telemetryHistory();

    // Sort chronologically for accurate line drawing
    const sortedHistory = [...history].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    const datasetLabel = this.translate.instant('tracking.dashboard.chart-label');

    return {
      labels: sortedHistory.map((p) =>
        new Date(p.timestamp).toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      ),
      datasets: [
        {
          data: sortedHistory.map((p) => p.recordedValue),
          label: datasetLabel,
          fill: true,
          borderColor: '#1a3a5c', // Standard branding color
          backgroundColor: 'rgba(26, 58, 92, 0.05)',
          pointBackgroundColor: sortedHistory.map((p) => (p.isAnomaly ? '#d32f2f' : '#1a3a5c')),
          pointBorderColor: '#ffffff',
          segment: {
            borderColor: (ctx) => {
              // Paints the segment red if it connects to or from an anomalous data point
              const p1Anomaly = sortedHistory[ctx.p0DataIndex]?.isAnomaly;
              const p2Anomaly = sortedHistory[ctx.p1DataIndex]?.isAnomaly;
              return p1Anomaly || p2Anomaly ? '#d32f2f' : '#1a3a5c';
            },
          },
        },
      ],
    };
  });

  // ── Lifecycle and Actions ────────────────────────────────────────────────

  /**
   * Lifecycle hook that initializes the component.
   *
   * @remarks
   * Initiates the load of available equipment. Polls the store briefly to
   * auto-select the first available equipment and render the initial chart.
   */
  ngOnInit(): void {
    this.equipmentStore.loadEquipment(this.currentLabId);

    const checkEquipment = setInterval(() => {
      const list = this.equipmentStore.equipmentList();
      if (list.length > 0) {
        this.filters.equipmentId = list[0].id;
        this.loadChartData();
        clearInterval(checkEquipment);
      }
    }, 500);
  }

  /**
   * Dispatches a command to load historical telemetry data based on the current
   * state of the analytical filters (Equipment ID and Date Ranges).
   */
  loadChartData(): void {
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
   * the chart with the full available history for the selected equipment.
   */
  clearFilters(): void {
    this.filters.dateFrom = null;
    this.filters.dateTo = null;
    this.loadChartData();
  }
}
