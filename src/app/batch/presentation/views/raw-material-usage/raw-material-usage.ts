import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

import { BatchStore } from '../../../application/batch.store';
import { LaboratoryStore } from '../../../../laboratory/application/laboratory.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { LinkRawMaterialCommand } from '../../../domain/model/link-raw-material.command';

/**
 * Component responsible for managing raw material usage within a production batch.
 *
 * @remarks
 * This standalone presentation component displays the raw material consumption
 * records associated with a batch and provides a form for linking additional
 * raw materials to the current batch.
 *
 * Available raw materials are loaded from the laboratory bounded context, while
 * consumption records are managed through the batch application store.
 */
@Component({
  selector: 'app-raw-material-usage',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './raw-material-usage.html',
  styleUrl: './raw-material-usage.css',
})
export class RawMaterialUsageComponent implements OnInit {
  /**
   * Numeric identifier of the production batch to which materials are linked.
   */
  @Input() batchId!: number;

  /**
   * FormBuilder used to create and configure the reactive form.
   */
  private readonly fb = inject(FormBuilder);

  /**
   * Store responsible for batch usage state and operations.
   */
  protected readonly store = inject(BatchStore);

  /**
   * Store responsible for loading available raw materials from the laboratory context.
   */
  protected readonly labStore = inject(LaboratoryStore);

  /**
   * Store responsible for retrieving the active user or laboratory context.
   */
  protected readonly iamStore = inject(IamStore);

  /**
   * Reactive form group for linking raw material usage.
   */
  protected usageForm!: FormGroup;

  /**
   * Columns rendered in the raw material usage table.
   */
  protected readonly displayedColumns: string[] = ['material', 'quantity', 'date'];

  /**
   * Gets the active numeric laboratory identifier.
   *
   * @remarks
   * The current implementation uses the authenticated user identifier as the
   * laboratory context and falls back to 1 when no session context is available.
   */
  private get currentLabId(): number {
    return this.iamStore.currentLaboratoryId() || 1;
  }

  /**
   * Lifecycle hook that initializes the form and loads available raw materials.
   */
  ngOnInit(): void {
    this.labStore.loadRawMaterials(this.currentLabId);

    if (this.batchId) {
      this.store.loadBatchUsage(this.batchId);
    }

    this.usageForm = this.fb.group({
      rawMaterialId: ['', Validators.required],
      quantityUsed: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  /**
   * Links the selected raw material to the current production batch.
   */
  protected onAddMaterial(): void {
    if (this.usageForm.invalid || !this.batchId) return;

    const command: LinkRawMaterialCommand = {
      rawMaterialId: Number(this.usageForm.value.rawMaterialId),
      quantityUsed: Number(this.usageForm.value.quantityUsed),
    };

    this.store.linkMaterial(this.batchId, command);
    this.usageForm.reset({ rawMaterialId: '', quantityUsed: 0 });
  }
}
