import { Component, OnInit, inject, computed } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { RaStore } from '../../../application/ra.store';
import { IamStore } from '../../../../iam/application/iam.store';

/**
 * Component responsible for displaying the Key Performance Indicator (KPI) dashboard.
 *
 * @remarks
 * In the presentation layer, this component acts as the primary visual interface
 * for the Reporting and Analysis (RA) domain's KPI features. It subscribes to the
 * reactive state managed by the {@link RaStore} and visualizes performance metrics
 * using both tabular formats and graphical charts through Chart.js.
 */
@Component({
  selector: 'app-kpi-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BaseChartDirective,
  ],
  templateUrl: './kpi-dashboard.html',
  styleUrl: './kpi-dashboard.css',
})
export class KpiDashboardComponent implements OnInit {
  /**
   * The application store managing the state for the RA bounded context.
   */
  protected readonly store = inject(RaStore);

  /**
   * The identity and access management store used to retrieve the current session context.
   */
  protected readonly iamStore = inject(IamStore);

  /**
   * Column identifiers displayed in the KPI metrics table.
   */
  protected readonly displayedColumns = ['name', 'status', 'current', 'target', 'recordedAt'];

  /**
   * General configuration options for the Chart.js KPI comparison chart.
   *
   * @remarks
   * The chart compares each metric's current value against its target value.
   */
  protected readonly barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
    plugins: {
      legend: { display: true, position: 'top' },
    },
  };

  /**
   * Visual representation type used by the KPI chart.
   */
  protected readonly barChartType: ChartType = 'bar';

  /**
   * Reactive computed signal that transforms KPI metrics into Chart.js data.
   *
   * @returns A bar chart data structure containing current and target metric values
   *
   * @remarks
   * This computed value updates automatically when the dashboard signal changes.
   */
  protected readonly chartData = computed<ChartData<'bar'>>(() => {
    const dashboard = this.store.dashboard();
    const metrics = dashboard?.metrics ?? [];

    return {
      labels: metrics.map((metric) => metric.name),
      datasets: [
        {
          data: metrics.map((metric) => metric.value),
          label: 'Current Value',
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderRadius: 4,
        },
        {
          data: metrics.map((metric) => metric.targetValue),
          label: 'Target Goal',
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderRadius: 4,
        },
      ],
    };
  });

  /**
   * Retrieves the current laboratory ID from the active application context.
   *
   * @returns The numeric laboratory identifier used to request KPI dashboard data
   *
   * @remarks
   * The current frontend context stores only the signed-in user ID. Until IAM exposes
   * a dedicated laboratory ID, the app keeps the existing convention used by the
   * other bounded contexts and falls back to `1` when no session value is available.
   */
  private get currentLaboratoryId(): number {
    const id = this.iamStore.currentUserId();
    return id ? Number(id) : 1;
  }

  /**
   * Lifecycle hook that loads the KPI dashboard when the component is initialized.
   */
  ngOnInit(): void {
    this.store.loadDashboard(this.currentLaboratoryId);
  }
}
