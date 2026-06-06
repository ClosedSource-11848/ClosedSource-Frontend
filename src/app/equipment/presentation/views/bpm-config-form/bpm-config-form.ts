import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { EquipmentStore } from '../../../application/equipment.store';
import { ConfigureBpmCommand } from '../../../domain/model/configure-bpm.command';

/**
 * Component responsible for displaying and handling the BPM configuration form.
 *
 * @remarks
 * This standalone Angular component allows the user to configure a BPM parameter
 * for a specific equipment. It obtains the equipment identifier from the route,
 * manages the form using Angular Reactive Forms, validates the entered data,
 * and sends the configuration command to the EquipmentStore.
 *
 * The component belongs to the equipment management feature and interacts with
 * the application layer through EquipmentStore instead of calling the API
 * directly.
 *
 * @example
 * ```html
 * <app-bpm-config-form></app-bpm-config-form>
 * ```
 */
@Component({
  selector: 'app-bpm-config-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterModule,
    TranslatePipe,
  ],
  templateUrl: './bpm-config-form.html',
  styleUrl: './bpm-config-form.css',
})
export class BpmConfigForm implements OnInit {
  /**
   * FormBuilder instance used to create and manage the reactive form.
   *
   * @remarks
   * It is injected using Angular's inject function and is used to define
   * the form structure and validation rules.
   */
  private readonly fb = inject(FormBuilder);

  /**
   * ActivatedRoute instance used to access route parameters.
   *
   * @remarks
   * This component uses the route to obtain the equipment identifier from
   * the current URL.
   */
  private readonly route = inject(ActivatedRoute);

  /**
   * Store responsible for equipment-related state and operations.
   *
   * @remarks
   * The store is used to send the BPM configuration command to the application
   * layer. It also exposes loading, success, and error states that can be used
   * by the template.
   */
  protected readonly store = inject(EquipmentStore);

  /**
   * Signal that stores the current numeric equipment identifier.
   *
   * @remarks
   * The value is obtained from the route parameter named id during component
   * initialization. It remains null if no equipment identifier is available.
   */
  protected readonly equipmentId = signal<number | null>(null);

  /**
   * Reactive form used to configure a BPM parameter.
   *
   * @remarks
   * The form contains the parameter name, minimum value, maximum value,
   * and measurement unit. Numeric fields use a pattern validator to allow
   * integer or decimal values, including negative values when needed.
   */
  protected form: FormGroup = this.fb.group({
    parameterName: ['', [Validators.required]],
    minValue: [null, [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)]],
    maxValue: [null, [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)]],
    unit: ['', [Validators.required]],
  });

  /**
   * Initializes the component and retrieves the equipment identifier from the route.
   *
   * @remarks
   * If the route contains an id parameter, it is stored in the equipmentId signal
   * so it can later be used when building the BPM configuration command.
   */
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) this.equipmentId.set(Number(idParam));
  }

  /**
   * Saves the BPM parameter configuration.
   *
   * @remarks
   * This method validates the form and verifies that an equipment identifier
   * exists before creating the ConfigureBpmCommand.
   *
   * If the form is valid, the command is sent to the EquipmentStore, which
   * handles the configuration process through the application and infrastructure
   * layers.
   */
  protected onSave(): void {
    if (this.form.invalid || !this.equipmentId()) return;

    const command: ConfigureBpmCommand = {
      equipmentId: this.equipmentId()!,
      ...this.form.value,
    };

    this.store.configureBpm(command);
  }
}
