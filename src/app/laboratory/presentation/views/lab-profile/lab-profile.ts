import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LaboratoryStore } from '../../../application/laboratory.store';

const LAB_ID = 'TEMP_LAB_ID'; // TODO: obtener desde IAM store

@Component({
  selector: 'app-lab-profile',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './lab-profile.html',
  styleUrl: './lab-profile.css',
})
export class LabProfile implements OnInit {
  protected readonly store = inject(LaboratoryStore);
  private readonly fb = inject(FormBuilder);

  protected isEditing = signal(false);

  protected readonly regulations = ['BPM_DIGEMID', 'ISO_9001', 'ISO_13485', 'GMP_WHO'];

  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    applicableRegulations: [[], Validators.required],
  });

  ngOnInit(): void {
    this.store.loadLaboratory(LAB_ID);
  }

  protected onEdit(): void {
    const lab = this.store.laboratory();
    if (!lab) return;
    this.form.patchValue({
      name: lab.name,
      address: lab.address,
      phone: lab.phone,
      applicableRegulations: lab.applicableRegulations,
    });
    this.isEditing.set(true);
  }

  protected onSave(): void {
    if (this.form.invalid) return;
    this.store.updateLaboratory(LAB_ID, this.form.getRawValue());
    this.isEditing.set(false);
  }

  protected onCancel(): void {
    this.isEditing.set(false);
    this.store.clearMessages();
  }
}
