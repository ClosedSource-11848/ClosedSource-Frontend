import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { EquipmentStatus } from '../../../domain/model/equipment-status.entity';

/**
 * Presentational component for displaying the real-time operational status of equipment.
 *
 * @remarks
 * Within the presentation layer, this acts as a "dumb" or pure UI component. It receives
 * the equipment's telemetry health data and identity via data bindings (Inputs) and is solely
 * responsible for rendering this information visually using Material Design cards.
 * It isolates UI rendering logic from data fetching or state management.
 */
@Component({
  selector: 'app-equipment-status-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatCardModule, MatIconModule],
  templateUrl: './equipment-status-card.html',
  styleUrl: './equipment-status-card.css',
})
export class EquipmentStatusCardComponent {
  /**
   * The current operational status record for the equipment.
   * * @remarks
   * Passed down from a smart parent component (container). It is marked as required
   * because the card cannot render its primary metrics without this domain entity.
   * Accepts `null` to handle asynchronous data loading states gracefully.
   */
  @Input({ required: true }) statusRecord!: EquipmentStatus | null;

  /**
   * The human-readable name, alias, or designation of the equipment.
   * * @remarks
   * Used for display purposes in the card header to give context to the user.
   * Defaults to an empty string if not explicitly provided by the parent.
   */
  @Input() equipmentName: string = '';
}
