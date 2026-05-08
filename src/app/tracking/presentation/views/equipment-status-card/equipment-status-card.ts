import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { EquipmentStatus } from '../../../domain/model/equipment-status.entity';

@Component({
  selector: 'app-equipment-status-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatCardModule, MatIconModule],
  templateUrl: './equipment-status-card.html',
  styleUrl: './equipment-status-card.css',
})
export class EquipmentStatusCardComponent {
  @Input({ required: true }) statusRecord!: EquipmentStatus | null;

  @Input() equipmentName: string = '';
}
