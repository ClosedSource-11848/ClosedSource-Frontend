import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

import { BatchStore } from '../../../application/batch.store';
import { RawMaterialUsageComponent } from '../raw-material-usage/raw-material-usage';

/**
 * Component for displaying the detailed information and management of a specific batch.
 */
@Component({
  selector: 'app-batch-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    TranslateModule,
    RawMaterialUsageComponent,
  ],
  templateUrl: './batch-detail.html',
  styleUrl: './batch-detail.css',
})
export class BatchDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(BatchStore);

  /**
   * The unique numeric identifier of the batch currently being viewed.
   */
  batchId!: number;

  /**
   * Lifecycle hook to initialize the component and load batch usage data.
   */
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.batchId = idParam ? Number(idParam) : 0;

    if (this.batchId) {
      this.store.loadBatchUsage(this.batchId);
    }
  }

  /**
   * Retrieves the current batch entity from the store.
   * @returns The Batch domain entity or undefined.
   */
  get currentBatch() {
    return this.store.batches().find((b) => b.id === this.batchId);
  }
}
