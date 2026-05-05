import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

import { CaStore } from '../../../application/ca.store';
import { UpdateNotificationPreferenceRequest } from '../../../infrastructure/notification-preference.request';
import { MatDivider } from '@angular/material/list';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDivider,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './notification-settings.html',
  styleUrl: './notification-settings.css',
})
export class NotificationSettings implements OnInit {
  protected readonly store = inject(CaStore);
  private readonly fb = inject(FormBuilder);

  settingsForm!: FormGroup;

  private readonly currentUserId = 'user-123';

  constructor() {
    this.initForm();

    effect(() => {
      const pref = this.store.preference();
      if (pref) {
        this.settingsForm.patchValue(
          {
            emailEnabled: pref.emailEnabled,
            smsEnabled: pref.smsEnabled,
            inAppEnabled: pref.inAppEnabled,
            minimumSeverity: pref.minimumSeverity,
          },
          { emitEvent: false },
        );
      }
    });
  }

  ngOnInit(): void {
    this.store.loadNotificationPreferences(this.currentUserId);
  }

  private initForm(): void {
    this.settingsForm = this.fb.group({
      emailEnabled: [true],
      smsEnabled: [false],
      inAppEnabled: [true],
      minimumSeverity: ['WARNING', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) return;

    const request: UpdateNotificationPreferenceRequest = this.settingsForm.value;
    this.store.updateNotificationPreferences(this.currentUserId, request);
  }
}
