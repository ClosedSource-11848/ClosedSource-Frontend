import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { EquipmentStore } from '../../../application/equipment.store';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterModule,
    TranslatePipe,
  ],
  templateUrl: './equipment-list.html',
  styleUrl: './equipment-list.css',
})
export class EquipmentList implements OnInit {
  protected readonly store = inject(EquipmentStore);
  private readonly iamStore = inject(IamStore);

  protected readonly displayedColumns: string[] = [
    'name',
    'type',
    'model',
    'serialNumber',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    const labId = this.iamStore.currentUserId();
    if (labId) {
      this.store.loadEquipment(labId);
    }
  }

  protected onRefresh(): void {
    const labId = this.iamStore.currentUserId();
    if (labId) this.store.loadEquipment(labId);
  }
}
