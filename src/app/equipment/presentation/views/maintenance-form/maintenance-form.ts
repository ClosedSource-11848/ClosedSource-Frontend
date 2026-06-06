import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { EquipmentStore } from '../../../application/equipment.store';
import { RegisterMaintenanceCommand } from '../../../domain/model/register-maintenance.command';

/**
 * Component responsible for displaying and handling the maintenance registration form.
 *
 * @remarks
 * This standalone Angular component allows the user to register a maintenance
 * activity for a specific equipment. It obtains the equipment identifier from
 * the route, manages the form using Angular Reactive Forms, validates the
 * entered information, and sends the maintenance registration command to the
 * EquipmentStore.
 *
 * The component belongs to the equipment management feature and communicates
 * with the application layer through EquipmentStore instead of calling the API
 * directly.
 *
 * Angular Material modules are used to build the form interface, including
 * inputs, select fields, date picker, buttons, icons, and cards.
 *
 * @example
 * ```html
 * <app-maintenance-form></app-maintenance-form>
 * ```
 */
@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    RouterModule,
    TranslatePipe,
  ],
  templateUrl: './maintenance-form.html',
  styleUrl: './maintenance-form.css',
})
export class MaintenanceForm implements OnInit {
  /**
   * FormBuilder instance used to create and configure the reactive form.
   *
   * @remarks
   * This dependency is injected using Angular's inject function and is used
   * to define the form controls, default values, and validation rules.
   */
  private readonly fb = inject(FormBuilder);

  /**
   * ActivatedRoute instance used to access route parameters.
   *
   * @remarks
   * This component uses the current route to obtain the equipment identifier
   * from the URL parameter named id.
   */
  private readonly route = inject(ActivatedRoute);

  /**
   * Store responsible for equipment-related state and operations.
   *
   * @remarks
   * The store is used to register the maintenance record and expose loading,
   * success, and error states that can be consumed by the component template.
   */
  protected readonly store = inject(EquipmentStore);

  /**
   * Signal that stores the current numeric equipment identifier.
   *
   * @remarks
   * The value is obtained from the route parameter during component
   * initialization. It remains null if no equipment identifier is available.
   */
  protected readonly equipmentId = signal<number | null>(null);

  /**
   * List of available maintenance types displayed in the form.
   *
   * @remarks
   * Each option contains an internal value used by the system and a display
   * label shown to the user in the select field.
   */
  protected readonly maintenanceTypes = [
    { value: 'PREVENTIVE', label: 'Preventivo' },
    { value: 'CORRECTIVE', label: 'Correctivo' },
    { value: 'CALIBRATION', label: 'Calibración' },
    { value: 'INSPECTION', label: 'Inspección' },
  ];

  /**
   * Reactive form used to register an equipment maintenance activity.
   *
   * @remarks
   * The form contains the maintenance date, technician name, maintenance type,
   * and description. Validators ensure that all required information is present,
   * the technician name has a minimum length, and the description does not
   * exceed the configured maximum length.
   */
  protected form: FormGroup = this.fb.group({
    maintenanceDate: [new Date(), Validators.required],
    technicianName: ['', [Validators.required, Validators.minLength(3)]],
    type: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(500)]],
  });

  /**
   * Initializes the component and retrieves the equipment identifier from the route.
   *
   * @remarks
   * If the route contains an id parameter, it is stored in the equipmentId signal
   * so it can later be used when creating the RegisterMaintenanceCommand.
   */
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) this.equipmentId.set(Number(idParam));
  }

  /**
   * Saves the maintenance registration form.
   *
   * @remarks
   * This method validates the form and verifies that an equipment identifier
   * exists before creating the RegisterMaintenanceCommand.
   *
   * The maintenance date is converted to ISO string format before sending
   * the command to the EquipmentStore. The actual registration process is
   * handled by the application layer.
   */
  protected onSave(): void {
    if (this.form.invalid || !this.equipmentId()) return;

    const formValue = this.form.value;
    const command: RegisterMaintenanceCommand = {
      equipmentId: this.equipmentId()!,
      technicianName: formValue.technicianName,
      type: formValue.type,
      description: formValue.description,
      maintenanceDate: formValue.maintenanceDate.toISOString(),
    };

    this.store.registerMaintenance(command);
  }
}
