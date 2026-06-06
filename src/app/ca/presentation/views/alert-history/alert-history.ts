import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { CaStore } from '../../../application/ca.store';

@Component({
  selector: 'app-alert-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    TranslateModule,
  ],
  templateUrl: './alert-history.html',
  styleUrl: './alert-history.css',
})
export class AlertHistory implements OnInit {
  /**
   * The application store instance for Compliance and Alerts.
   */
  protected readonly store = inject(CaStore);

  /**
   * Angular Router for handling navigation to alert details.
   */
  private readonly router = inject(Router);

  /**
   * Form builder service to create the reactive filter form.
   */
  private readonly fb = inject(FormBuilder);

  /**
   * Form group for managing alert search filters.
   */
  filterForm!: FormGroup;

  /**
   * Configuration for the columns to be displayed in the history table.
   */
  displayedColumns: string[] = [
    'timestamp',
    'equipmentId',
    'parameter',
    'severity',
    'status',
    'actions',
  ];

  /**
   * Creates an instance of AlertHistory and initializes the filter form structure.
   */
  constructor() {
    this.initFilterForm();
  }

  /**
   * Initializes the component by loading the initial set of alerts.
   */
  ngOnInit(): void {
    this.store.loadAlerts();
  }

  /**
   * Defines the structure and initial values of the filter form.
   * @private
   */
  private initFilterForm(): void {
    this.filterForm = this.fb.group({
      status: [''],
      severity: [''],
      equipmentId: [''],
    });
  }

  /**
   * Processes the form values and triggers a filtered data load in the store.
   *
   * @remarks
   * Filters out null or empty values before dispatching the load action
   * to ensure clean query parameters are sent to the API. It also ensures
   * numeric identifiers are correctly typed.
   */
  applyFilters(): void {
    const rawFilters = this.filterForm.value;
    const cleanFilters = Object.fromEntries(
      Object.entries(rawFilters)
        .filter(([_, v]) => v !== null && v !== '')
        .map(([k, v]) => [k, k === 'equipmentId' ? Number(v) : v]),
    );

    this.store.loadAlerts(cleanFilters);
  }

  /**
   * Resets the filter form and reloads the complete alerts list.
   */
  clearFilters(): void {
    this.filterForm.reset({ status: '', severity: '', equipmentId: '' });
    this.store.loadAlerts();
  }

  /**
   * Navigates to the detailed information view of a specific alert.
   *
   * @param alertId - The unique numeric identifier of the deviation alert.
   */
  viewDetails(alertId: number): void {
    this.router.navigate(['/alerts/deviation-detail', alertId]);
  }
}
