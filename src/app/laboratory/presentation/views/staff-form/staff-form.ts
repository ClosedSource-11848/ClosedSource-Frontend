import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LaboratoryStore } from '../../../application/laboratory.store';

const LAB_ID = 'TEMP_LAB_ID';

@Component({
  selector: 'app-staff-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatFormFieldModule,
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
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly roles = ['QA_MANAGER', 'LAB_OPERATOR', 'AUDITOR'];

  protected form: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(150)]],
    role: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.store.registerStaff(LAB_ID, {
      labId: LAB_ID,
      ...this.form.getRawValue(),
    });
    this.router.navigate(['/laboratory/staff-list']);
  }

  protected onCancel(): void {
    this.router.navigate(['/laboratory/staff-list']);
  }
}
