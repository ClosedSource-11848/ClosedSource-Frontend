import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
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
  selector: 'app-raw-material-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatCard,
    MatCardHeader,
    MatIcon,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './raw-material-form.html',
  styleUrl: './raw-material-form.css',
})
export class RawMaterialForm {
  protected readonly store = inject(LaboratoryStore);
  protected readonly iamStore = inject(IamStore);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly units = ['kg', 'g', 'L', 'mL', 'units'];

  private get currentLabId(): string {
    return this.iamStore.currentUserId() || 'DEFAULT_LAB_ID';
  }

  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    code: ['', [Validators.required, Validators.maxLength(50)]],
    supplier: ['', Validators.required],
    batchNumber: ['', Validators.required],
    expirationDate: ['', Validators.required],
    quantityInStock: [null, [Validators.required, Validators.min(0)]],
    unit: ['', Validators.required],
    minimumStock: [null, [Validators.required, Validators.min(0)]],
  });

  protected onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.store.createRawMaterial(this.currentLabId, {
      labId: this.currentLabId,
      ...value,
      expirationDate: new Date(value.expirationDate).toISOString().split('T')[0],
    });
    this.router.navigate(['/laboratory/raw-material-list']);
  }

  protected onCancel(): void {
    this.router.navigate(['/laboratory/raw-material-list']);
  }
}
