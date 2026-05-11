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
  protected readonly store = inject(CaStore);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  filterForm!: FormGroup;
  displayedColumns: string[] = [
    'timestamp',
    'equipmentId',
    'parameter',
    'severity',
    'status',
    'actions',
  ];

  constructor() {
    this.initFilterForm();
  }

  ngOnInit(): void {
    this.store.loadAlerts();
  }

  private initFilterForm(): void {
    this.filterForm = this.fb.group({
      status: [''],
      severity: [''],
      equipmentId: [''],
    });
  }

  applyFilters(): void {
    const rawFilters = this.filterForm.value;
    const cleanFilters = Object.fromEntries(
      Object.entries(rawFilters).filter(([_, v]) => v !== null && v !== ''),
    );

    this.store.loadAlerts(cleanFilters);
  }

  clearFilters(): void {
    this.filterForm.reset({ status: '', severity: '', equipmentId: '' });
    this.store.loadAlerts();
  }

  viewDetails(alertId: string): void {
    this.router.navigate(['/alerts/deviation-detail', alertId]);
  }
}
