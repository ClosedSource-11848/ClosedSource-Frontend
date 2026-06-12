import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Component displayed after a successful payment flow.
 *
 * @remarks
 * This view confirms that the checkout process was completed successfully from
 * the user's perspective. The backend webhook remains the source of truth for
 * actually activating the subscription.
 */
@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css',
})
export class PaymentSuccess {}
