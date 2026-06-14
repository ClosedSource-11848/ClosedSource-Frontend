import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
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
 * In the presentation layer, this component coordinates Tracking, Equipment,
 * and IAM state to provide a real-time operational view of equipment telemetry.
 * It loads the selected equipment status, latest measurements, and historical
 * telemetry points, then renders the historical values through Chart.js.
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
export class TelemetryDashboardComponent implements OnInit, OnDestroy {
  /**
   * Store that manages Tracking bounded context state.
   */
  protected readonly store = inject(TrackingStore);

  /**
   * Store that manages Equipment bounded context state.
   */
  protected readonly equipmentStore = inject(EquipmentStore);

  /**
   * Store that exposes authenticated user context.
   */
  protected readonly iamStore = inject(IamStore);

  /**
   * Translation service used to resolve dynamic chart labels.
   */
  private readonly translate = inject(TranslateService);

  /**
   * Numeric identifier of the currently selected equipment.
   */
  protected readonly selectedEquipmentId = signal<number>(0);

  /**
   * Interval reference used while waiting for equipment data to be available.
   */
  private equipmentPollingId: ReturnType<typeof setInterval> | null = null;

  /**
   * Retrieves the current laboratory ID based on the authenticated context.
   *
   * @remarks
   * The value is converted to number to keep consistency with the backend API,
   * where laboratory and equipment identifiers are numeric.
   */
  private get currentLabId(): number {
    const id = this.iamStore.currentLaboratoryId();
    return id ? Number(id) : 1;
  }

  /**
   * General configuration options for the telemetry line chart.
   */
  protected readonly chartOptions: ChartOptions<'line'> = {
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
   * Computed chart data generated from historical telemetry points.
   *
   * @remarks
   * The history is sorted chronologically before rendering. Points marked as
   * anomalies are highlighted with a different color so the chart can visually
   * expose deviations.
   */
  protected readonly chartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const history = this.store.telemetryHistory();
    const sortedHistory = [...history].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    return {
      labels: sortedHistory.map((point) =>
        new Date(point.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      ),
      datasets: [
        {
          data: sortedHistory.map((point) => point.recordedValue),
          label: this.translate.instant('tracking.dashboard.chart-label'),
          fill: true,
          borderColor: '#1a3a5c',
          backgroundColor: 'rgba(26, 58, 92, 0.1)',
          pointBackgroundColor: sortedHistory.map((point) =>
            point.isAnomaly ? '#d32f2f' : '#1a3a5c',
          ),
          pointBorderColor: '#ffffff',
        },
      ],
    };
  });

  /**
   * Lifecycle hook that loads available equipment and initializes dashboard data.
   *
   * @remarks
   * The component first loads equipment for the current laboratory. Once the
   * equipment list is available, it selects the first equipment and loads the
   * Tracking data associated with that equipment.
   */
  ngOnInit(): void {
    this.equipmentStore.loadEquipment(this.currentLabId);
    this.waitForEquipmentAndLoadDashboard();
  }

  /**
   * Lifecycle hook that clears the equipment polling interval when the component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.equipmentPollingId) {
      clearInterval(this.equipmentPollingId);
      this.equipmentPollingId = null;
    }
  }

  /**
   * Handles equipment selection changes from the UI.
   */
  protected onEquipmentChange(): void {
    this.loadDashboardData();
  }

  /**
   * Waits until the equipment list is populated, then selects the first available equipment.
   */
  private waitForEquipmentAndLoadDashboard(): void {
    this.equipmentPollingId = setInterval(() => {
      const equipmentList = this.equipmentStore.equipmentList();

      if (equipmentList.length === 0) return;

      this.selectedEquipmentId.set(equipmentList[0].id);
      this.loadDashboardData();

      if (this.equipmentPollingId) {
        clearInterval(this.equipmentPollingId);
        this.equipmentPollingId = null;
      }
    }, 500);
  }

  /**
   * Loads telemetry status, latest measurements, and historical telemetry for the selected equipment.
   */
  private loadDashboardData(): void {
    const equipmentId = this.selectedEquipmentId();
    if (!equipmentId) return;

    this.store.loadEquipmentStatus(equipmentId);
    this.store.loadLatestMeasurements(equipmentId);
    this.store.loadTelemetryHistory({ equipmentId });
  }
}
