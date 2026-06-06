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
 * reactive state managed by the `RaStore` and visualizes performance metrics using
 * both tabular formats and graphical charts (via Chart.js).
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
   * The application store managing the state for the RA domain.
   */
  protected readonly store = inject(RaStore);

  /**
   * The identity and access management store, used to retrieve current context.
   */
  protected readonly iamStore = inject(IamStore);

  /**
   * Configuration for the columns displayed in the KPI metrics table.
   */
  protected readonly displayedColumns = ['name', 'status', 'current', 'target', 'recordedAt'];

  /**
   * General configuration options for the Chart.js instance.
   */
  protected barChartOptions: ChartConfiguration['options'] = {
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
   * Defines the visual representation type of the chart.
   */
  protected barChartType: ChartType = 'bar';

  /**
   * Reactive computed signal that transforms domain KPI metrics into a structure
   * compatible with Chart.js.
   *
   * @remarks
   * Dynamically extracts metric names for labels, and maps current values and
   * target values into separate datasets for visual comparison.
   */
  protected chartData = computed<ChartData<'bar'>>(() => {
    const dash = this.store.dashboard();
    const metricsList = dash?.metrics || [];

    return {
      labels: metricsList.map((metric) => metric.name),
      datasets: [
        {
          data: metricsList.map((metric) => metric.value),
          label: 'Current Value',
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderRadius: 4,
        },
        {
          data: metricsList.map((metric) => metric.targetValue),
          label: 'Target Goal',
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderRadius: 4,
        },
      ],
    };
  });

  /**
   * Retrieves the current laboratory ID based on the authenticated user's context.
   * * @remarks
   * Ensures the ID is correctly typed as a number for consistency with domain entities.
   * Defaults to 1 if no user context is found.
   */
  private get currentLabId(): number {
    const id = this.iamStore.currentUserId();
    return id ? Number(id) : 1;
  }

  /**
   * Lifecycle hook that initializes the component by triggering the KPI data load.
   */
  ngOnInit(): void {
    this.store.loadDashboard(this.currentLabId);
  }
}
