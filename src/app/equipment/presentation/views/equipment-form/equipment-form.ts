import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { EquipmentStore } from '../../../application/equipment.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { RegisterEquipmentCommand } from '../../../domain/model/register-equipment.command';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Component responsible for displaying and handling the equipment registration form.
 *
 * @remarks
 * This standalone Angular component allows the user to register new equipment
 * associated with the current laboratory or authenticated user context.
 *
 * It uses Angular Reactive Forms to manage form data and validations, Material
 * components to build the user interface, and EquipmentStore to send the
 * registration command to the application layer.
 *
 * The component also obtains the laboratory identifier from IamStore, which is
 * used as the labId when creating the RegisterEquipmentCommand.
 *
 * @example
 * ```html
 * <app-equipment-form></app-equipment-form>
 * ```
 */
@Component({
  selector: 'app-equipment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule,
    TranslatePipe,
  ],
  templateUrl: './equipment-form.html',
  styleUrl: './equipment-form.css',
})
export class EquipmentForm {
  /**
   * FormBuilder instance used to create and configure the reactive form.
   *
   * @remarks
   * This dependency is injected using Angular's inject function and is used
   * to define the form controls, default values, and validation rules.
   */
  private readonly fb = inject(FormBuilder);

  /**
   * Store responsible for equipment-related state and operations.
   *
   * @remarks
   * The store is used to register new equipment and expose loading, success,
   * and error states that can be consumed by the component template.
   */
  protected readonly store = inject(EquipmentStore);

  /**
   * Store responsible for identity and access management state.
   *
   * @remarks
   * This store is used to obtain the current numeric user identifier, which is treated
   * as the laboratory identifier when registering equipment.
   */
  private readonly iamStore = inject(IamStore);

  /**
   * List of available equipment types displayed in the form.
   *
   * @remarks
   * These values are used as selectable options so the user can classify the
   * equipment being registered according to its technical or operational type.
   */
  protected readonly equipmentTypes = [
    'Autoclave',
    'Centrifuge',
    'Incubator',
    'Mixer',
    'Refrigerator',
    'HPLC System',
    'IoT Sensor',
  ];

  /**
   * Reactive form used to register equipment.
   *
   * @remarks
   * The form contains fields for equipment name, type, model, and serial number.
   * Validators ensure that required data is provided, the name has a minimum
   * length, and the serial number only contains letters, numbers, and hyphens.
   */
  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    type: ['', Validators.required],
    model: ['', Validators.required],
    serialNumber: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9-]+$/)]],
  });

  /**
   * Saves the equipment registration form.
   *
   * @remarks
   * This method first validates the form. Then, it retrieves the current labId
   * from IamStore. If both the form and labId are valid, it creates a
   * RegisterEquipmentCommand and sends it to EquipmentStore.
   *
   * The actual registration process is handled by the application layer through
   * the store.
   */
  protected onSave(): void {
    if (this.form.invalid) return;

    const labId = this.iamStore.currentUserId();
    if (!labId) return;

    const command: RegisterEquipmentCommand = {
      ...this.form.value,
      labId: Number(labId),
    };

    this.store.registerEquipment(command);
  }
}
