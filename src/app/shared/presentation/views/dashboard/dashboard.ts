import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { IamStore } from '../../../../iam/application/iam.store';
import { LaboratoryStore } from '../../../../laboratory/application/laboratory.store';
import { EquipmentStore } from '../../../../equipment/application/equipment.store';
import { BatchStore } from '../../../../batch/application/batch.store';
import { CaStore } from '../../../../ca/application/ca.store';
import { RaStore } from '../../../../ra/application/ra.store';
import { TrackingStore } from '../../../../tracking/application/tracking.store';

/**
 * Main operational dashboard for QualiTrack.
 *
 * @remarks
 * Aggregates information from the main bounded contexts to provide a professional
 * overview of laboratory operations, compliance alerts, equipment status,
 * production batches, KPI health, and telemetry activity.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDividerModule,
    BaseChartDirective,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  protected readonly iamStore = inject(IamStore);
  protected readonly laboratoryStore = inject(LaboratoryStore);
  protected readonly equipmentStore = inject(EquipmentStore);
  protected readonly batchStore = inject(BatchStore);
  protected readonly caStore = inject(CaStore);
  protected readonly raStore = inject(RaStore);
  protected readonly trackingStore = inject(TrackingStore);

  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  private equipmentPollId?: ReturnType<typeof setInterval>;
  private telemetryInitialized = false;
  private langSubscription?: Subscription;

  /**
   * Signal used to recompute chart labels when the app language changes.
   */
  private readonly languageVersion = signal(0);

  protected readonly overviewChartType: ChartType = 'doughnut';
  protected readonly riskChartType: ChartType = 'bar';

  protected readonly chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 16,
        },
      },
    },
  };

  protected readonly riskChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  private get currentLabId(): number {
    const id = this.iamStore.currentUserId();
    return id ? Number(id) : 1;
  }

  protected readonly isLoading = computed(
    () =>
      this.laboratoryStore.isLoading() ||
      this.equipmentStore.isLoading() ||
      this.batchStore.isLoading() ||
      this.caStore.loading() ||
      this.raStore.isLoading() ||
      this.trackingStore.isLoading(),
  );

  protected readonly healthScore = computed(
    () => this.raStore.dashboard()?.overallHealthScore ?? 0,
  );

  protected readonly healthLabelKey = computed(() => {
    const score = this.healthScore();
    if (score >= 85) return 'dashboard.health.healthy';
    if (score >= 65) return 'dashboard.health.attention';
    return 'dashboard.health.critical';
  });

  protected readonly healthClass = computed(() => {
    const score = this.healthScore();
    if (score >= 85) return 'health-good';
    if (score >= 65) return 'health-warning';
    return 'health-critical';
  });

  protected readonly summaryCards = computed(() => [
    {
      labelKey: 'dashboard.cards.equipment',
      value: this.equipmentStore.equipmentList().length,
      detailKey: 'dashboard.cards.operational',
      detailParams: { count: this.equipmentStore.operationalEquipment().length },
      icon: 'precision_manufacturing',
      className: 'card-blue',
      route: '/equipments/equipment-list',
    },
    {
      labelKey: 'dashboard.cards.batches',
      value: this.batchStore.batches().length,
      detailKey: 'dashboard.cards.in-progress',
      detailParams: { count: this.batchStore.pendingBatches().length },
      icon: 'inventory',
      className: 'card-teal',
      route: '/batches/batch-list',
    },
    {
      labelKey: 'dashboard.cards.alerts',
      value: this.caStore.alertsCount(),
      detailKey: 'dashboard.cards.critical',
      detailParams: { count: this.caStore.criticalAlertsCount() },
      icon: 'notification_important',
      className: 'card-rose',
      route: '/alerts/alert-dashboard',
    },
    {
      labelKey: 'dashboard.cards.raw-materials',
      value: this.laboratoryStore.rawMaterials().length,
      detailKey: 'dashboard.cards.low-stock',
      detailParams: { count: this.laboratoryStore.lowStock().length },
      icon: 'science',
      className: 'card-amber',
      route: '/laboratories/raw-material-list',
    },
  ]);

  protected readonly overviewChartData = computed<ChartData<'doughnut'>>(() => {
    this.languageVersion();

    const values = [
      this.laboratoryStore.staffList().length,
      this.laboratoryStore.products().length,
      this.laboratoryStore.rawMaterials().length,
      this.equipmentStore.equipmentList().length,
      this.batchStore.batches().length,
    ];

    const hasData = values.some((value) => value > 0);

    return {
      labels: hasData
        ? [
            this.t('dashboard.charts.staff'),
            this.t('dashboard.charts.products'),
            this.t('dashboard.charts.raw-materials'),
            this.t('dashboard.charts.equipment'),
            this.t('dashboard.charts.batches'),
          ]
        : [this.t('dashboard.charts.no-data')],
      datasets: [
        {
          data: hasData ? values : [1],
          backgroundColor: hasData
            ? ['#2563eb', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444']
            : ['#e5e7eb'],
          borderWidth: 0,
        },
      ],
    };
  });

  protected readonly riskChartData = computed<ChartData<'bar'>>(() => {
    this.languageVersion();

    return {
      labels: [
        this.t('dashboard.charts.low-stock'),
        this.t('dashboard.charts.maintenance'),
        this.t('dashboard.charts.critical-alerts'),
        this.t('dashboard.charts.critical-kpis'),
        this.t('dashboard.charts.anomalies'),
      ],
      datasets: [
        {
          data: [
            this.laboratoryStore.lowStock().length,
            this.equipmentStore.needsMaintenance().length,
            this.caStore.criticalAlertsCount(),
            this.raStore.criticalMetrics().length,
            this.trackingStore.anomaliesHistory().length,
          ],
          backgroundColor: ['#f59e0b', '#8b5cf6', '#ef4444', '#dc2626', '#0f766e'],
          borderRadius: 6,
        },
      ],
    };
  });

  protected readonly attentionItems = computed(() =>
    [
      {
        labelKey: 'dashboard.attention.low-stock-materials',
        value: this.laboratoryStore.lowStock().length,
        icon: 'inventory_2',
        route: '/laboratories/raw-material-list',
      },
      {
        labelKey: 'dashboard.attention.equipment-maintenance',
        value: this.equipmentStore.needsMaintenance().length,
        icon: 'build',
        route: '/equipments/equipment-list',
      },
      {
        labelKey: 'dashboard.attention.critical-compliance-alerts',
        value: this.caStore.criticalAlertsCount(),
        icon: 'report_problem',
        route: '/alerts/alert-dashboard',
      },
      {
        labelKey: 'dashboard.attention.telemetry-anomalies',
        value: this.trackingStore.anomaliesHistory().length,
        icon: 'sensors',
        route: '/tracking/history',
      },
    ].filter((item) => item.value > 0),
  );

  ngOnInit(): void {
    const labId = this.currentLabId;

    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.languageVersion.update((value) => value + 1);
    });

    this.laboratoryStore.loadLaboratory(labId);
    this.laboratoryStore.loadStaff(labId);
    this.laboratoryStore.loadProducts(labId);
    this.laboratoryStore.loadRawMaterials(labId);

    this.equipmentStore.loadEquipment(labId);
    this.batchStore.loadBatches(labId);
    this.caStore.loadAlerts();
    this.raStore.loadDashboard(labId);

    this.initializeTelemetryFromFirstEquipment();
  }

  ngOnDestroy(): void {
    if (this.equipmentPollId) clearInterval(this.equipmentPollId);
    this.langSubscription?.unsubscribe();
  }

  protected navigateTo(route: string): void {
    this.router.navigateByUrl(route).then();
  }

  private initializeTelemetryFromFirstEquipment(): void {
    this.equipmentPollId = setInterval(() => {
      const equipment = this.equipmentStore.equipmentList()[0];

      if (!equipment || this.telemetryInitialized) return;

      this.telemetryInitialized = true;
      this.trackingStore.loadEquipmentStatus(equipment.id);
      this.trackingStore.loadLatestMeasurements(equipment.id);
      this.trackingStore.loadTelemetryHistory({ equipmentId: equipment.id });

      if (this.equipmentPollId) clearInterval(this.equipmentPollId);
    }, 400);
  }

  private t(key: string, params?: Record<string, unknown>): string {
    return this.translate.instant(key, params);
  }
}
