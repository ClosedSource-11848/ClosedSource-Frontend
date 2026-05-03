import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { LaboratoryStore } from '../../../application/laboratory.store';

const LAB_ID = 'TEMP_LAB_ID';

@Component({
  selector: 'app-raw-material-list',
  imports: [
    TranslatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatBadgeModule,
  ],
  templateUrl: './raw-material-list.html',
  styleUrl: './raw-material-list.css',
})
export class RawMaterialList implements OnInit {
  protected readonly store = inject(LaboratoryStore);
  private readonly router = inject(Router);

  protected readonly displayedColumns = [
    'name',
    'code',
    'supplier',
    'stock',
    'expirationDate',
    'status',
  ];

  ngOnInit(): void {
    this.store.loadRawMaterials(LAB_ID);
  }

  protected isLowStock(quantityInStock: number, minimumStock: number): boolean {
    return quantityInStock <= minimumStock;
  }

  protected onAdd(): void {
    this.router.navigate(['/laboratory/raw-material-form']);
  }
}
