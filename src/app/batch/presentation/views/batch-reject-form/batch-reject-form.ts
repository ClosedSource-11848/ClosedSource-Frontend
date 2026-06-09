import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { BatchStore } from '../../../application/batch.store';
import { RejectBatchCommand } from '../../../domain/model/reject-batch.command';

/**
 * Component responsible for managing the batch rejection process.
 */
@Component({
  selector: 'app-batch-reject-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './batch-reject-form.html',
  styleUrl: './batch-reject-form.css',
})
export class BatchRejectForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly store = inject(BatchStore);

  rejectForm!: FormGroup;
  batchId!: number;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.batchId = idParam ? Number(idParam) : 0;

    this.rejectForm = this.fb.group({
      rejectionDate: [new Date().toISOString().substring(0, 10), Validators.required],
      reason: ['', [Validators.required, Validators.minLength(15)]],
    });
  }

  onSubmit(): void {
    if (this.rejectForm.invalid || !this.batchId) return;

    const command: RejectBatchCommand = {
      rejectionDate: this.rejectForm.value.rejectionDate,
      reason: this.rejectForm.value.reason,
    };

    this.store.rejectBatch(this.batchId, command);
    this.router.navigate(['/batches/batch-list']).then();
  }
}
