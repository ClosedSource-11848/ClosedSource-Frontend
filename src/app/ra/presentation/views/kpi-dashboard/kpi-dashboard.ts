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
  protected readonly store = inject(RaStore);
  protected readonly iamStore = inject(IamStore);

  protected readonly displayedColumns = ['name', 'status', 'current', 'target', 'recordedAt'];

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

  protected barChartType: ChartType = 'bar';

  protected chartData = computed<ChartData<'bar'>>(() => {
    const dash = this.store.dashboard();
    const metricsList = dash?.metrics || [];

    return {
      labels: metricsList.map((metric: any) => metric.name),
      datasets: [
        {
          data: metricsList.map((metric: any) => metric.value),
          label: 'Current Value',
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderRadius: 4,
        },
        {
          data: metricsList.map((metric: any) => metric.targetValue),
          label: 'Target Goal',
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderRadius: 4,
        },
      ],
    };
  });

  private get currentLabId(): string {
    return this.iamStore.currentUserId() || 'LAB-001';
  }

  ngOnInit(): void {
    this.store.loadDashboard(this.currentLabId);
  }
}
