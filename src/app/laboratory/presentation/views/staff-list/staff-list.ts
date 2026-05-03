import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { LaboratoryStore } from '../../../application/laboratory.store';

const LAB_ID = 'TEMP_LAB_ID';

@Component({
  selector: 'app-staff-list',
  imports: [
    TranslatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './staff-list.html',
  styleUrl: './staff-list.css',
})
export class StaffList implements OnInit {
  protected readonly store = inject(LaboratoryStore);
  private readonly router = inject(Router);

  protected readonly displayedColumns = ['fullName', 'role', 'email', 'active', 'actions'];

  ngOnInit(): void {
    this.store.loadStaff(LAB_ID);
  }

  protected onRegister(): void {
    this.router.navigate(['/laboratory/staff-form']);
  }

  protected onDeactivate(staffId: string): void {
    this.store.deactivateStaff(LAB_ID, staffId);
  }
}
