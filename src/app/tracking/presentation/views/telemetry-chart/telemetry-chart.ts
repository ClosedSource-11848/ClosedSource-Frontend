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
  protected readonly store = inject(TrackingStore);
  protected readonly equipmentStore = inject(EquipmentStore);
  protected readonly iamStore = inject(IamStore);
  private readonly translate = inject(TranslateService);

  // ── Filtros Analíticos ───────────────────────────────────────────────────
  protected filters = {
    equipmentId: '',
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
  };

  private get currentLabId(): string {
    return this.iamStore.currentUserId() || 'LAB-001';
  }

  // ── Configuración de Chart.js ────────────────────────────────────────────
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

  public chartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const history = this.store.telemetryHistory();

    // Ordenar cronológicamente
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
          borderColor: '#1a3a5c', // Estilo QualiTrack
          backgroundColor: 'rgba(26, 58, 92, 0.05)',
          pointBackgroundColor: sortedHistory.map((p) => (p.isAnomaly ? '#d32f2f' : '#1a3a5c')),
          pointBorderColor: '#ffffff',
          segment: {
            borderColor: (ctx) => {
              // Pinta el segmento de rojo si conecta con una anomalía
              const p1Anomaly = sortedHistory[ctx.p0DataIndex]?.isAnomaly;
              const p2Anomaly = sortedHistory[ctx.p1DataIndex]?.isAnomaly;
              return p1Anomaly || p2Anomaly ? '#d32f2f' : '#1a3a5c';
            },
          },
        },
      ],
    };
  });

  // ── Ciclo de Vida y Acciones ─────────────────────────────────────────────
  ngOnInit(): void {
    this.equipmentStore.loadEquipment(this.currentLabId);

    // Autoseleccionar el primer equipo cuando cargue
    const checkEquipment = setInterval(() => {
      const list = this.equipmentStore.equipmentList();
      if (list.length > 0) {
        this.filters.equipmentId = list[0].id;
        this.loadChartData();
        clearInterval(checkEquipment);
      }
    }, 500);
  }

  loadChartData(): void {
    if (!this.filters.equipmentId) return;

    const query: any = { equipmentId: this.filters.equipmentId };

    if (this.filters.dateFrom) query.from = this.filters.dateFrom.toISOString();
    if (this.filters.dateTo) query.to = this.filters.dateTo.toISOString();

    this.store.loadTelemetryHistory(query);
  }

  clearFilters(): void {
    this.filters.dateFrom = null;
    this.filters.dateTo = null;
    this.loadChartData();
  }
}
