import { Component, OnInit, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { RaStore } from '../../../application/ra.store';

/**
 * Component responsible for visualizing historical deviation trends for specific equipment.
 *
 * @remarks
 * In the presentation layer, this component subscribes to the reactive state managed
 * by the `RaStore` to display a tabular analysis of parameter trends over time.
 * It highlights measurements that breach defined operational thresholds.
 */
@Component({
  selector: 'app-deviation-trend-chart',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './deviation-trend-chart.html',
  styleUrl: './deviation-trend-chart.css',
})
export class DeviationTrendChartComponent implements OnInit {
  /**
   * The application store managing the state for the Reporting and Analysis (RA) domain.
   */
  protected readonly store = inject(RaStore);

  /**
   * Configuration for the columns displayed in the trend data table.
   */
  protected readonly displayedColumns = [
    'timestamp',
    'recordedValue',
    'lowerThreshold',
    'upperThreshold',
    'status',
  ];

  /**
   * The unique numeric identifier of the equipment to analyze.
   * Passed in as a component input. Defaults to 1001 for demonstration.
   */
  @Input() equipmentId: number = 1001;

  /**
   * Reactive signal holding the currently selected equipment numeric ID.
   */
  protected selectedEquipmentId = signal<number>(0);

  /**
   * Lifecycle hook that initializes the component by setting the equipment ID
   * signal and triggering the initial data load.
   */
  ngOnInit(): void {
    this.selectedEquipmentId.set(this.equipmentId);
    this.loadTrends();
  }

  /**
   * Triggers a request to the store to load trend data for the currently selected equipment.
   */
  loadTrends(): void {
    this.store.loadDeviationTrends(this.selectedEquipmentId());
  }

  /**
   * Resolves the appropriate Material icon name based on the detected trend direction.
   *
   * @param direction - The string representation of the trend ('INCREASING', 'DECREASING', or 'STABLE')
   * @returns The corresponding Material Design icon identifier
   */
  getTrendIcon(direction: string): string {
    switch (direction) {
      case 'INCREASING':
        return 'trending_up';
      case 'DECREASING':
        return 'trending_down';
      default:
        return 'trending_flat';
    }
  }

  /**
   * Evaluates whether a specific measurement falls outside its acceptable operational thresholds.
   *
   * @param value - The recorded measurement value
   * @param min - The lower acceptable threshold bound
   * @param max - The upper acceptable threshold bound
   * @returns True if the value represents a deviation (out of bounds), false otherwise
   */
  isDeviated(value: number, min: number, max: number): boolean {
    return value < min || value > max;
  }
}
