import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { CaStore } from '../../../application/ca.store';
import { EquipmentStore } from '../../../../equipment/application/equipment.store';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-alert-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslateModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './alert-dashboard.html',
  styleUrl: './alert-dashboard.css',
})
export class AlertDashboard implements OnInit, OnDestroy {
  protected readonly store = inject(CaStore);
  protected readonly equipmentStore = inject(EquipmentStore);
  protected readonly iamStore = inject(IamStore);

  private readonly router = inject(Router);

  protected readonly selectedEquipmentId = signal<number>(0);

  protected readonly displayedColumns: string[] = [
    'timestamp',
    'parameter',
    'severity',
    'status',
    'actions',
  ];

  private equipmentPollingId: ReturnType<typeof setInterval> | null = null;

  private get currentLaboratoryId(): number {
    const id = this.iamStore.currentLaboratoryId();
    return id ? Number(id) : 1;
  }

  ngOnInit(): void {
    this.equipmentStore.loadEquipment(this.currentLaboratoryId);
    this.waitForEquipmentAndLoadAlerts();
  }

  ngOnDestroy(): void {
    if (this.equipmentPollingId) {
      clearInterval(this.equipmentPollingId);
      this.equipmentPollingId = null;
    }
  }

  protected onEquipmentChange(): void {
    this.loadData();
  }

  protected onRefresh(): void {
    this.loadData();
  }

  protected viewDetails(alertId: number): void {
    this.router.navigate(['/alerts/deviation-detail', alertId]).then();
  }

  private waitForEquipmentAndLoadAlerts(): void {
    this.equipmentPollingId = setInterval(() => {
      const equipmentList = this.equipmentStore.equipmentList();

      if (equipmentList.length === 0) return;

      this.selectedEquipmentId.set(equipmentList[0].id);
      this.loadData();

      if (this.equipmentPollingId) {
        clearInterval(this.equipmentPollingId);
        this.equipmentPollingId = null;
      }
    }, 500);
  }

  private loadData(): void {
    const equipmentId = this.selectedEquipmentId();
    if (!equipmentId) return;

    this.store.loadAlerts({ equipmentId });
  }
}
