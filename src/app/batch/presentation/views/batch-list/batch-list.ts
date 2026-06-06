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
import { IamStore } from '../../../../iam/application/iam.store';

/**
 * Displays the collection of manufacturing batches in a table.
 */
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
  protected readonly iamStore = inject(IamStore);

  /**
   * Columns to be rendered in the batches table.
   */
  displayedColumns: string[] = [
    'batchNumber',
    'productName',
    'quantity',
    'status',
    'startDate',
    'actions',
  ];

  /**
   * Gets the active numeric laboratory ID from the security context.
   */
  private get currentLabId(): number {
    return this.iamStore.currentUserId() || 1;
  }

  /**
   * Lifecycle hook to initialize the batch collection.
   */
  ngOnInit(): void {
    this.store.loadBatches(this.currentLabId);
  }

  /**
   * Reloads the batch list from the server.
   */
  onRefresh(): void {
    this.store.loadBatches(this.currentLabId);
  }

  /**
   * Maps the batch status to a CSS class for styling.
   * @param status - The current status of the batch.
   */
  getStatusClass(status: string): string {
    return status ? status.toLowerCase().replace('_', '-') : 'pending';
  }
}
