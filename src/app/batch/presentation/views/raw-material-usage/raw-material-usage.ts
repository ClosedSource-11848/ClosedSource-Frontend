import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { BatchStore } from '../../../application/batch.store';
import { LaboratoryStore } from '../../../../laboratory/application/laboratory.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

/**
 * Component for managing and displaying raw material consumption within a batch.
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
   * The identifier of the production batch to which materials are linked.
   */
  @Input() batchId!: string;

  private readonly fb = inject(FormBuilder);
  protected readonly store = inject(BatchStore);
  protected readonly labStore = inject(LaboratoryStore);
  protected readonly iamStore = inject(IamStore);

  /**
   * Reactive form group for linking new raw materials.
   */
  usageForm!: FormGroup;

  /**
   * Columns to be rendered in the material usage table.
   */
  displayedColumns: string[] = ['material', 'quantity', 'date'];

  /**
   * Gets the active laboratory ID from the security context.
   */
  private get currentLabId(): string {
    return this.iamStore.currentUserId() || 'LAB-001';
  }

  /**
   * Initializes the component and loads available raw materials for the laboratory.
   */
  ngOnInit(): void {
    this.labStore.loadRawMaterials(this.currentLabId);

    this.usageForm = this.fb.group({
      rawMaterialId: ['', Validators.required],
      quantityUsed: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  /**
   * Processes the form submission to link a raw material to the current batch.
   */
  onAddMaterial(): void {
    if (this.usageForm.valid && this.batchId) {
      const command = {
        ...this.usageForm.value,
        batchId: this.batchId,
      };
      this.store.linkMaterial(this.batchId, command);
      this.usageForm.reset({ quantityUsed: 0 });
    }
  }
}
