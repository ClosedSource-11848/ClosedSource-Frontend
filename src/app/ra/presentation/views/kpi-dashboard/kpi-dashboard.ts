import { Component, OnInit, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RaStore } from '../../../application/ra.store';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-kpi-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './kpi-dashboard.html',
  styleUrl: './kpi-dashboard.css',
})
export class KpiDashboardComponent implements OnInit {
  protected readonly store = inject(RaStore);
  protected readonly iamStore = inject(IamStore);

  protected readonly displayedColumns = ['name', 'status', 'current', 'target', 'recordedAt'];

  private get currentLabId(): string {
    return this.iamStore.currentUserId() || 'DEFAULT_LAB_ID';
  }

  ngOnInit(): void {
    this.store.loadDashboard(this.currentLabId);
  }
}
