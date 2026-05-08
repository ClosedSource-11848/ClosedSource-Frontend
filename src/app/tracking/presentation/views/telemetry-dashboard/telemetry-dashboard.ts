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
    BaseChartDirective
  ],
  templateUrl: './telemetry-dashboard.html',
  styleUrl: './telemetry-dashboard.css',
})
export class TelemetryDashboardComponent implements OnInit {
  protected readonly store = inject(TrackingStore);
  protected readonly equipmentStore = inject(EquipmentStore);
  protected readonly iamStore = inject(IamStore);
  private readonly translate = inject(TranslateService);

  protected selectedEquipmentId = signal<string>('');

  private get currentLabId(): string {
    return this.iamStore.currentUserId() || 'LAB-001';
  }

  // ── Configuración de Chart.js (Consistente con QualiTrack) ────────────────
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
          pointBackgroundColor: sortedHistory.map((p) => (p.isAnomaly ? '#d32f2f' : '#1a3a5c')),
          pointBorderColor: '#ffffff',
        },
      ],
    };
  });

  // ── Lifecycle y Carga de Datos Reales ────────────────────────────────────
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

  onEquipmentChange(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const eqId = this.selectedEquipmentId();
    if (!eqId) return;

    this.store.loadEquipmentStatus(eqId);
    this.store.loadLatestMeasurements();
    this.store.loadTelemetryHistory({ equipmentId: eqId });
  }
}
