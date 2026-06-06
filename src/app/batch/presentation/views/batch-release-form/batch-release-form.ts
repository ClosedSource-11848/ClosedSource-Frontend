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

/**
 * Component responsible for managing the batch release process.
 */
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

  /**
   * Reactive form group for batch release data.
   */
  releaseForm!: FormGroup;

  /**
   * The unique numeric identifier of the batch to be released.
   */
  batchId!: number;

  /**
   * Initializes the component and sets up the release form.
   */
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.batchId = idParam ? Number(idParam) : 0;

    this.releaseForm = this.fb.group({
      releaseDate: [new Date().toISOString().substring(0, 10), Validators.required],
      notes: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  /**
   * Processes the form submission to release the batch.
   */
  onSubmit(): void {
    if (this.releaseForm.valid && this.batchId) {
      const command: ReleaseBatchCommand = {
        batchId: this.batchId,
        ...this.releaseForm.value,
      };

      this.store.releaseBatch(this.batchId, command);
      this.router.navigate(['/batches/batch-list']).then();
    }
  }
}
