import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { TrackingStore } from '../../../application/tracking.store';
import { EquipmentStore } from '../../../../equipment/application/equipment.store';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-telemetry-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  templateUrl: './telemetry-history.html',
  styleUrl: './telemetry-history.css',
})
export class TelemetryHistoryComponent implements OnInit {
  protected readonly store = inject(TrackingStore);
  protected readonly equipmentStore = inject(EquipmentStore);
  protected readonly iamStore = inject(IamStore);

  // Columnas para la tabla de Material
  protected readonly displayedColumns = ['timestamp', 'parameterName', 'recordedValue', 'status'];

  // ── Filtros ──────────────────────────────────────────────────────────────
  protected filters = {
    equipmentId: '',
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
  };

  private get currentLabId(): string {
    return this.iamStore.currentUserId() || 'LAB-001';
  }

  // ── Ciclo de Vida ────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.equipmentStore.loadEquipment(this.currentLabId);

    // Auto-seleccionar el primer equipo
    const checkEquipment = setInterval(() => {
      const list = this.equipmentStore.equipmentList();
      if (list.length > 0) {
        this.filters.equipmentId = list[0].id;
        this.loadHistoryData();
        clearInterval(checkEquipment);
      }
    }, 500);
  }

  loadHistoryData(): void {
    if (!this.filters.equipmentId) return;

    const query: any = { equipmentId: this.filters.equipmentId };
    if (this.filters.dateFrom) query.from = this.filters.dateFrom.toISOString();
    if (this.filters.dateTo) query.to = this.filters.dateTo.toISOString();

    this.store.loadTelemetryHistory(query);
  }

  clearFilters(): void {
    this.filters.dateFrom = null;
    this.filters.dateTo = null;
    this.loadHistoryData();
  }
}
