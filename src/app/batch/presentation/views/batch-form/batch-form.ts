import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { BatchStore } from '../../../application/batch.store';
import { LaboratoryStore } from '../../../../laboratory/application/laboratory.store';

@Component({
  selector: 'app-batch-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './batch-form.html',
  styleUrl: './batch-form.css',
})
export class BatchForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly store = inject(BatchStore);
  protected readonly labStore = inject(LaboratoryStore);

  batchForm!: FormGroup;

  ngOnInit(): void {
    const labId = 'LAB-001';
    this.labStore.loadProducts(labId);

    this.batchForm = this.fb.group({
      productId: ['', Validators.required],
      batchNumber: ['', [Validators.required, Validators.pattern(/^LOT-\d{4}-\d{3}$/)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      startDate: [new Date().toISOString().substring(0, 10), Validators.required],
      notes: [''],
    });
  }

  onSubmit(): void {
    if (this.batchForm.valid) {
      const command = {
        ...this.batchForm.value,
        labId: 'LAB-001',
      };
      this.store.createBatch(command);

      this.router.navigate(['/equipment/batch-list']);
    }
  }
}
