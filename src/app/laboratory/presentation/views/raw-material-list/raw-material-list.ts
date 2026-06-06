import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { LaboratoryStore } from '../../../application/laboratory.store';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-raw-material-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './raw-material-list.html',
  styleUrl: './raw-material-list.css',
})
export class RawMaterialList implements OnInit {
  protected readonly store = inject(LaboratoryStore);
  protected readonly iamStore = inject(IamStore);
  private readonly router = inject(Router);

  private get currentLabId(): number {
    return this.iamStore.currentUserId() || 1;
  }

  protected readonly displayedColumns = [
    'name',
    'code',
    'supplier',
    'stock',
    'expirationDate',
    'status',
  ];

  ngOnInit(): void {
    this.store.loadRawMaterials(this.currentLabId);
  }

  protected isLowStock(quantity: number, min: number): boolean {
    return quantity <= min;
  }

  protected onAdd(): void {
    this.router.navigate(['/laboratories/raw-material-form']);
  }
}
