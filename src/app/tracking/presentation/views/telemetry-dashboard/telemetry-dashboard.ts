import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

import { TrackingStore } from '../../../application/tracking.store';
import { EquipmentStore } from '../../../../equipment/application/equipment.store';
import { IamStore } from '../../../../iam/application/iam.store';

/**
 * Component responsible for displaying the main telemetry and IoT tracking dashboard.
 *
 * @remarks
 * In the presentation layer, this component orchestrates data from multiple domains
 * (Tracking, Equipment, and IAM) to provide a unified real-time visualization of
 * equipment health. It utilizes Chart.js to render time-series telemetry data and
 * highlights operational anomalies automatically.
 */
@Component({
  selector: 'app-telemetry-dashboard',
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
    MatProgressSpinnerModule,
    BaseChartDirective,
  ],
  templateUrl: './telemetry-dashboard.html',
  styleUrl: './telemetry-dashboard.css',
})
export class TelemetryDashboardComponent implements OnInit {
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

  /**
   * Reactive signal holding the numeric ID of the currently selected equipment.
   */
  protected selectedEquipmentId = signal<number>(0);

  /**
   * Retrieves the current laboratory ID based on the authenticated user's context.
   *
   * @remarks
   * Converts the ID to a numeric value for domain entity consistency. Defaults to 1.
   */
  private get currentLabId(): number {
    const id = this.iamStore.currentUserId();
    return id ? Number(id) : 1;
  }

  // ── Configuración de Chart.js (Consistente con QualiTrack) ────────────────

  /**
   * General configuration options for the Chart.js line chart instance.
   * Defines responsiveness, tooltips, axes, and line tension.
   */
  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: false },
    },
    elements: {
      point: { radius: 4, hoverRadius: 6 },
      line: { tension: 0.4 },
    },
  };

  /**
   * Reactive computed signal that transforms historical telemetry points into
   * a structure compatible with Chart.js line charts.
   *
   * @remarks
   * Sorts history chronologically and maps anomalous points to distinct colors
   * (e.g., red for anomalies, dark blue for normal) to provide immediate visual
   * cues regarding equipment health.
   */
  public chartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const history = this.store.telemetryHistory();
    const sortedHistory = [...history].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    const datasetLabel = this.translate.instant('tracking.dashboard.chart-label');

    return {
      labels: sortedHistory.map((p) =>
        new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ),
      datasets: [
        {
          data: sortedHistory.map((p) => p.recordedValue),
          label: datasetLabel,
          fill: true,
          borderColor: '#1a3a5c',
          backgroundColor: 'rgba(26, 58, 92, 0.1)',
          // Visually distinguish anomalies with a red color indicator
          pointBackgroundColor: sortedHistory.map((p) => (p.isAnomaly ? '#d32f2f' : '#1a3a5c')),
          pointBorderColor: '#ffffff',
        },
      ],
    };
  });

  // ── Lifecycle y Carga de Datos Reales ────────────────────────────────────

  /**
   * Lifecycle hook that initializes the component.
   *
   * @remarks
   * Initiates the load of available equipment for the current lab context. Uses a
   * short-lived interval to poll the equipment store until populated, ensuring
   * the dashboard auto-selects the first available machine to display immediate data.
   */
  ngOnInit(): void {
    this.equipmentStore.loadEquipment(this.currentLabId);

    const checkEquipment = setInterval(() => {
      const list = this.equipmentStore.equipmentList();
      if (list.length > 0) {
        this.selectedEquipmentId.set(list[0].id);
        this.loadDashboardData();
        clearInterval(checkEquipment);
      }
    }, 500);
  }

  /**
   * Event handler triggered when the user changes the selected equipment in the UI dropdown.
   */
  onEquipmentChange(): void {
    this.loadDashboardData();
  }

  /**
   * Dispatches commands to the TrackingStore to load real-time status, latest
   * measurements, and historical telemetry for the currently selected equipment.
   */
  private loadDashboardData(): void {
    const eqId = this.selectedEquipmentId();
    if (!eqId) return;

    this.store.loadEquipmentStatus(eqId);
    this.store.loadLatestMeasurements();

    // Convert to string for the API call if the store expects a string filter
    this.store.loadTelemetryHistory({ equipmentId: eqId });
  }
}
