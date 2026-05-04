import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { EquipmentStore } from '../../../application/equipment.store';

@Component({
  selector: 'app-equipment-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    RouterModule,
    TranslatePipe,
  ],
  templateUrl: './equipment-detail.html',
  styleUrl: './equipment-detail.css',
})
export class EquipmentDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(EquipmentStore);

  protected readonly equipmentId = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.equipmentId.set(id);
      // Carga coordinada de datos relacionados
      this.store.loadBpmConfig(id);
      this.store.loadMaintenanceHistory(id);
    }
  }

  // Helper para encontrar el equipo actual en la lista del store
  protected get currentEquipment() {
    return this.store.equipmentList().find((e) => e.id === this.equipmentId());
  }
}
