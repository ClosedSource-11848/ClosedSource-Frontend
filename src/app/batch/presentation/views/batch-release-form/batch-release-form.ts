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
import { ReleaseBatchCommand } from '../../../domain/model/release-batch.command';

@Component({
  selector: 'app-batch-release-form',
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
  templateUrl: './batch-release-form.html',
  styleUrl: './batch-release-form.css',
})
export class BatchReleaseForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly store = inject(BatchStore);

  releaseForm!: FormGroup;
  batchId!: string;

  ngOnInit(): void {
    this.batchId = this.route.snapshot.paramMap.get('id') || '';

    this.releaseForm = this.fb.group({
      releaseDate: [new Date().toISOString().substring(0, 10), Validators.required],
      notes: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit(): void {
    if (this.releaseForm.valid && this.batchId) {
      const command: ReleaseBatchCommand = {
        batchId: this.batchId,
        ...this.releaseForm.value,
      };

      this.store.releaseBatch(this.batchId, command);
      this.router.navigate(['/equipment/batch-list']);
    }
  }
}
