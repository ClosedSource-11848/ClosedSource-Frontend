import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { EquipmentStore } from '../../../application/equipment.store';

@Component({
  selector: 'app-maintenance-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule,
    TranslatePipe,
  ],
  templateUrl: './maintenance-history.html',
  styleUrl: './maintenance-history.css',
})
export class MaintenanceHistory implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(EquipmentStore);

  protected readonly equipmentId = signal<string | null>(null);
  protected readonly displayedColumns: string[] = ['date', 'type', 'technician', 'description'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.equipmentId.set(id);
      this.store.loadMaintenanceHistory(id);
    }
  }

  protected onBack(): void {
    window.history.back();
  }
}
