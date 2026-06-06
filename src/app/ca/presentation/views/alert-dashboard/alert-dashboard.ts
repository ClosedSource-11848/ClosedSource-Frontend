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
  /**
   * The application store instance for Compliance and Alerts.
   */
  protected readonly store = inject(CaStore);

  /**
   * Angular Router for handling navigation within the dashboard.
   */
  private readonly router = inject(Router);

  /**
   * Configuration for the columns to be displayed in the Angular Material table.
   */
  displayedColumns: string[] = ['timestamp', 'parameter', 'severity', 'status', 'actions'];

  /**
   * Initializes the component and triggers the data loading process.
   */
  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Refreshes the alerts data from the store.
   */
  onRefresh(): void {
    this.loadData();
  }

  /**
   * Dispatches the loadAlerts action to the application store.
   * @private
   */
  private loadData(): void {
    this.store.loadAlerts();
  }

  /**
   * Navigates to the detailed view of a specific deviation alert.
   *
   * @param alertId - The unique numeric identifier of the alert to be viewed.
   */
  viewDetails(alertId: number): void {
    this.router.navigate(['/alerts/deviation-detail', alertId]);
  }
}
