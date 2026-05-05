import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
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
    TranslatePipe,
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

  // Columnas para la tabla de puntos de datos
  protected readonly displayedColumns = [
    'timestamp',
    'recordedValue',
    'lowerThreshold',
    'upperThreshold',
    'status',
  ];

  // Simulación de un ID de equipo seleccionado (en producción vendría por @Input o Router Params)
  protected selectedEquipmentId = signal<string>('EQ-1001');

  ngOnInit(): void {
    this.loadTrends();
  }

  loadTrends(): void {
    this.store.loadDeviationTrends(this.selectedEquipmentId());
  }

  // Helpers para la UI
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
