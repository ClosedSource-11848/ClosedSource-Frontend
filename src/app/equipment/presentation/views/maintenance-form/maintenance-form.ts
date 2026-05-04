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
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(EquipmentStore);

  protected readonly equipmentId = signal<string | null>(null);

  protected readonly maintenanceTypes = [
    { value: 'PREVENTIVE', label: 'Preventivo' },
    { value: 'CORRECTIVE', label: 'Correctivo' },
    { value: 'CALIBRATION', label: 'Calibración' },
    { value: 'INSPECTION', label: 'Inspección' },
  ];

  protected form: FormGroup = this.fb.group({
    maintenanceDate: [new Date(), Validators.required],
    technicianName: ['', [Validators.required, Validators.minLength(3)]],
    type: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.equipmentId.set(id);
  }

  protected onSave(): void {
    if (this.form.invalid || !this.equipmentId()) return;

    const formValue = this.form.value;
    const command: RegisterMaintenanceCommand = {
      equipmentId: this.equipmentId()!,
      technicianName: formValue.technicianName,
      type: formValue.type,
      description: formValue.description,
      // Convertimos la fecha a string ISO para el backend[cite: 7, 11]
      maintenanceDate: formValue.maintenanceDate.toISOString(),
    };

    this.store.registerMaintenance(command);
  }
}
