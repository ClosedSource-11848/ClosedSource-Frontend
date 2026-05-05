import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import { CaStore } from '../../../application/ca.store';

@Component({
  selector: 'app-alert-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './alert-dashboard.html',
  styleUrl: './alert-dashboard.css',
})
export class AlertDashboard implements OnInit {
  protected readonly store = inject(CaStore);
  private readonly router = inject(Router);

  displayedColumns: string[] = ['timestamp', 'parameter', 'severity', 'status', 'actions'];

  ngOnInit(): void {
    this.loadData();
  }

  onRefresh(): void {
    this.loadData();
  }

  private loadData(): void {
    this.store.loadAlerts();
  }

  viewDetails(alertId: string): void {
    this.router.navigate(['/ca/deviation-detail', alertId]);
  }
}
