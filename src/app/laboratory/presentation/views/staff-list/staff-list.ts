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
  selector: 'app-staff-list',
  standalone: true,
  imports: [
    TranslateModule,
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
  protected readonly iamStore = inject(IamStore);
  private readonly router = inject(Router);

  private get currentLabId(): number {
    return this.iamStore.currentUserId() || 1;
  }

  protected readonly displayedColumns = ['fullName', 'role', 'email', 'active', 'actions'];

  ngOnInit(): void {
    this.store.loadStaff(this.currentLabId);
  }

  protected onRegister(): void {
    this.router.navigate(['/laboratories/staff-form']);
  }

  protected onDeactivate(staffId: number): void {
    if (confirm('Are you sure you want to deactivate this staff member?')) {
      this.store.deactivateStaff(this.currentLabId, staffId);
    }
  }
}
