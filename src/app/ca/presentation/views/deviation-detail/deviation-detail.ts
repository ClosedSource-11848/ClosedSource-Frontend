import { Component, OnInit, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';

import { CaStore } from '../../../application/ca.store';
import { DeviationAlert } from '../../../domain/model/deviation-alert.entity';

@Component({
  selector: 'app-deviation-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    TranslateModule,
  ],
  templateUrl: './deviation-detail.html',
  styleUrl: './deviation-detail.css',
})
export class DeviationDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(CaStore);

  alertId: number = 0;
  alert!: Signal<DeviationAlert | undefined>;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.alertId = idParam ? Number(idParam) : 0;

    this.alert = this.store.getAlertById(this.alertId);

    if (this.alertId) {
      this.store.loadAlertById(this.alertId);
    }
  }
}
