import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { RaStore } from '../../../application/ra.store';
import { TrendDirection } from '../../../domain/model/deviation-trend.entity';

/**
 * Component responsible for visualizing historical deviation trends for specific equipment.
 *
 * @remarks
 * In the presentation layer, this component subscribes to the reactive state managed
 * by {@link RaStore} to display tabular trend analysis for equipment process parameters.
 * It highlights measurements that breach their configured operational thresholds.
 *
 * The component expects an `equipmentId` input. If no equipment ID is provided,
 * it does not issue a backend request.
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
   * The application store managing the state for the Reporting and Analysis bounded context.
   */
  protected readonly store = inject(RaStore);

  /**
   * Column identifiers displayed in the trend data table.
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
   *
   * @remarks
   * This value should be provided by the parent component or route context.
   * A value of `0` means no equipment has been selected yet.
   */
  @Input() equipmentId: number = 0;

  /**
   * Reactive signal holding the currently selected equipment numeric identifier.
   */
  protected readonly selectedEquipmentId = signal<number>(0);

  /**
   * Lifecycle hook that initializes the component and loads trends when an equipment is selected.
   */
  ngOnInit(): void {
    this.selectedEquipmentId.set(Number(this.equipmentId) || 0);
    this.loadTrends();
  }

  /**
   * Loads trend data for the currently selected equipment.
   *
   * @remarks
   * The method skips the request when no valid equipment ID is available.
   */
  protected loadTrends(): void {
    const equipmentId = this.selectedEquipmentId();
    if (!equipmentId) return;

    this.store.loadDeviationTrends(equipmentId);
  }

  /**
   * Resolves the Material icon name based on the detected trend direction.
   *
   * @param direction - The detected trend direction
   * @returns The corresponding Material Design icon identifier
   */
  protected getTrendIcon(direction: TrendDirection): string {
    switch (direction) {
      case 'INCREASING':
        return 'trending_up';
      case 'DECREASING':
        return 'trending_down';
      case 'STABLE':
      default:
        return 'trending_flat';
    }
  }

  /**
   * Evaluates whether a specific measurement falls outside its acceptable thresholds.
   *
   * @param value - The recorded measurement value
   * @param min - The lower acceptable threshold bound
   * @param max - The upper acceptable threshold bound
   * @returns `true` when the value is outside the accepted range; otherwise `false`
   */
  protected isDeviated(value: number, min: number, max: number): boolean {
    return value < min || value > max;
  }
}
