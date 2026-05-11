import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Cambiamos TranslatePipe por TranslateModule para mantener la consistencia
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LaboratoryStore } from '../../../application/laboratory.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-lab-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
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
  protected readonly iamStore = inject(IamStore);
  private readonly fb = inject(FormBuilder);

  protected isEditing = signal(false);

  protected readonly regulations = ['BPM_DIGEMID', 'ISO_9001', 'ISO_13485', 'GMP_WHO'];

  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    applicableRegulations: [[], Validators.required],
  });

  private get currentLabId(): string {
    return this.iamStore.currentUserId() || 'LAB-001';
  }

  ngOnInit(): void {
    this.store.loadLaboratory(this.currentLabId);
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
    this.store.updateLaboratory(this.currentLabId, this.form.getRawValue());
    this.isEditing.set(false);
  }

  protected onCancel(): void {
    this.isEditing.set(false);
    this.store.clearMessages();
  }
}
