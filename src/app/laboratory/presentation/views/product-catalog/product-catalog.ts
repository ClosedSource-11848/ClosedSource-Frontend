import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { LaboratoryStore } from '../../../application/laboratory.store';
import { PharmaceuticalProduct } from '../../../domain/model/pharmaceutical-product.entity';

const LAB_ID = 'TEMP_LAB_ID';

@Component({
  selector: 'app-product-catalog',
  imports: [
    TranslatePipe,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
  templateUrl: './product-catalog.html',
  styleUrl: './product-catalog.css',
})
export class ProductCatalog implements OnInit {
  protected readonly store = inject(LaboratoryStore);
  private readonly router = inject(Router);

  protected searchTerm = signal('');
  protected readonly displayedColumns = ['code', 'name', 'specifications', 'active'];

  ngOnInit(): void {
    this.store.loadProducts(LAB_ID);
  }

  protected get filtered(): PharmaceuticalProduct[] {
    const term = this.searchTerm().toLowerCase();
    return this.store
      .products()
      .filter((p) => p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term));
  }

  protected onAdd(): void {
    this.router.navigate(['/laboratory/product-form']);
  }
}
