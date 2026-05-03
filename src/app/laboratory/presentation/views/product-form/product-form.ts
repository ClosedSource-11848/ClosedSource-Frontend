import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LaboratoryStore } from '../../../application/laboratory.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-product-form',
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
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {
  protected readonly store = inject(LaboratoryStore);
  protected readonly iamStore = inject(IamStore);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  private get currentLabId(): string {
    return this.iamStore.currentUserId() || 'DEFAULT_LAB_ID';
  }

  protected form: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(50)]],
    name: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', Validators.required],
    specifications: ['', Validators.required],
  });

  protected onSubmit(): void {
    if (this.form.invalid) return;

    this.store.createProduct(this.currentLabId, {
      labId: this.currentLabId,
      ...this.form.getRawValue(),
    });

    this.router.navigate(['/laboratory/product-catalog']);
  }

  protected onCancel(): void {
    this.router.navigate(['/laboratory/product-catalog']);
  }
}
