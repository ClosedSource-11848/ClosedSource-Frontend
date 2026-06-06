import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LaboratoryStore } from '../../../application/laboratory.store';
import { IamStore } from '../../../../iam/application/iam.store';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-staff-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatCard,
    MatCardHeader,
    MatIcon,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './staff-form.html',
  styleUrl: './staff-form.css',
})
export class StaffForm {
  protected readonly store = inject(LaboratoryStore);
  protected readonly iamStore = inject(IamStore);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly roles = ['QA_MANAGER', 'LAB_OPERATOR', 'AUDITOR'];

  private get currentLabId(): number {
    return this.iamStore.currentUserId() || 1;
  }

  protected form: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(150)]],
    role: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.store.registerStaff(this.currentLabId, {
      labId: this.currentLabId,
      ...this.form.getRawValue(),
    });
    this.router.navigate(['/laboratories/staff-list']);
  }

  protected onCancel(): void {
    this.router.navigate(['/laboratories/staff-list']);
  }
}
