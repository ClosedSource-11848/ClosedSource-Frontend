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
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

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
  @Input() batchId!: string;

  private readonly fb = inject(FormBuilder);
  protected readonly store = inject(BatchStore);
  protected readonly labStore = inject(LaboratoryStore);

  usageForm!: FormGroup;
  displayedColumns: string[] = ['material', 'quantity', 'date'];

  ngOnInit(): void {
    const labId = 'LAB-001';
    this.labStore.loadRawMaterials(labId);

    this.usageForm = this.fb.group({
      rawMaterialId: ['', Validators.required],
      quantityUsed: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

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
