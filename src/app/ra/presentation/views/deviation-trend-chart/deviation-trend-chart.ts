import { Component, OnInit, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { RaStore } from '../../../application/ra.store';

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
  protected readonly store = inject(RaStore);

  protected readonly displayedColumns = [
    'timestamp',
    'recordedValue',
    'lowerThreshold',
    'upperThreshold',
    'status',
  ];

  @Input() equipmentId: string = 'EQ-1001';

  protected selectedEquipmentId = signal<string>('');

  ngOnInit(): void {
    this.selectedEquipmentId.set(this.equipmentId);
    this.loadTrends();
  }

  loadTrends(): void {
    this.store.loadDeviationTrends(this.selectedEquipmentId());
  }

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

  isDeviated(value: number, min: number, max: number): boolean {
    return value < min || value > max;
  }
}
