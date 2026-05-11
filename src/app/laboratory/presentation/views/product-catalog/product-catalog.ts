import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { LaboratoryStore } from '../../../application/laboratory.store';
import { PharmaceuticalProduct } from '../../../domain/model/pharmaceutical-product.entity';
import { IamStore } from '../../../../iam/application/iam.store';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [
    TranslateModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatIcon,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
  templateUrl: './product-catalog.html',
  styleUrl: './product-catalog.css',
})
export class ProductCatalog implements OnInit {
  protected readonly store = inject(LaboratoryStore);
  protected readonly iamStore = inject(IamStore);
  private readonly router = inject(Router);

  private get currentLabId(): string {
    return this.iamStore.currentUserId() || 'LAB-001';
  }

  protected searchTerm = signal('');
  protected readonly displayedColumns = ['code', 'name', 'specifications', 'active'];

  ngOnInit(): void {
    this.store.loadProducts(this.currentLabId);
  }

  protected get filtered(): PharmaceuticalProduct[] {
    const term = this.searchTerm().toLowerCase();
    return this.store
      .products()
      .filter((p) => p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term));
  }

  protected onAdd(): void {
    this.router.navigate(['/laboratories/product-form']);
  }
}
