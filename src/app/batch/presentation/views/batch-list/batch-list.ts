import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

import { BatchStore } from '../../../application/batch.store';

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './batch-list.html',
  styleUrl: './batch-list.css',
})
export class BatchList implements OnInit {
  protected readonly store = inject(BatchStore);

  displayedColumns: string[] = [
    'batchNumber',
    'productName',
    'quantity',
    'status',
    'startDate',
    'actions',
  ];

  ngOnInit(): void {
    const labId = 'LAB-001';
    this.store.loadBatches(labId);
  }

  onRefresh(): void {
    const labId = 'LAB-001';
    this.store.loadBatches(labId);
  }

  getStatusClass(status: string): string {
    return status ? status.toLowerCase().replace('_', '-') : 'pending';
  }
}
