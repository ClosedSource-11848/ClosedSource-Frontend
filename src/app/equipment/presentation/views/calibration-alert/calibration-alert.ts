import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { EquipmentStore } from '../../../application/equipment.store';

@Component({
  selector: 'app-calibration-alert',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    TranslatePipe,
  ],
  templateUrl: './calibration-alert.html',
  styleUrl: './calibration-alert.css',
})
export class CalibrationAlert {
  protected readonly store = inject(EquipmentStore);
}
