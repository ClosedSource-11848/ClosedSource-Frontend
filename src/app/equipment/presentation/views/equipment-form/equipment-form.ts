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
    RouterModule,
    TranslatePipe,
  ],
  templateUrl: './equipment-form.html',
  styleUrl: './equipment-form.css',
})
export class EquipmentForm {
  private readonly fb = inject(FormBuilder);
  protected readonly store = inject(EquipmentStore);
  private readonly iamStore = inject(IamStore);

  // Opciones predefinidas para el tipo de equipo
  protected readonly equipmentTypes = [
    'Autoclave',
    'Centrifuge',
    'Incubator',
    'Mixer',
    'Refrigerator',
    'HPLC System',
    'IoT Sensor',
  ];

  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    type: ['', Validators.required],
    model: ['', Validators.required],
    serialNumber: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9-]+$/)]],
  });

  protected onSave(): void {
    if (this.form.invalid) return;

    const labId = this.iamStore.currentUserId();
    if (!labId) return;

    const command: RegisterEquipmentCommand = {
      ...this.form.value,
      labId: labId,
    };

    this.store.registerEquipment(command);
  }
}
