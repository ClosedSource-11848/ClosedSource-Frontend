import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { RouterOutlet } from '@angular/router';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslatePipe,
    RouterOutlet,
    LanguageSwitcher,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  @ViewChild(MatSidenav) drawer!: MatSidenav;

  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  options = [
    { label: 'nav.dashboard', icon: 'analytics', link: '/tracking/dashboard' },
    {
      label: 'nav.batches',
      icon: 'inventory_2',
      link: '/batch',
      children: [
        { label: 'batches.title', link: '/batch/batch-list' },
        { label: 'product-form.title', link: '/batch/batch-form' },
        { label: 'equipment-detail.title', link: '/batch/batch-detail' },
        { label: 'batches.actions.release', link: '/batch/batch-release-form' },
        { label: 'batches.actions.reject', link: '/batch/batch-reject-form' },
      ],
    },
    {
      label: 'nav.equipment',
      icon: 'settings_suggest',
      link: '/equipment',
      children: [
        { label: 'equipment-list.title', link: '/equipment/equipment-list' },
        { label: 'equipment-form.title', link: '/equipment/register-equipment' },
        { label: 'equipment-detail.title', link: '/equipment/equipment-detail' },
        { label: 'bpm-config.title', link: '/equipment/bpm-config-form' },
        { label: 'maintenance-history.title', link: '/equipment/maintenance-history' },
        { label: 'maintenance-form.title', link: '/equipment/maintenance-form' },
      ],
    },

    {
      label: 'nav.alerts',
      icon: 'warning',
      link: '/ca',
      children: [
        { label: 'nav.dashboard', link: '/ca/alert-dashboard' },
        { label: 'ca-alerts.history.title', link: '/ca/alert-history' },
        { label: 'ca-alerts.detail.title', link: '/ca/deviation-detail' },
        { label: 'ca-alerts.settings.title', link: '/ca/notification-settings' },
      ],
    },

    { label: 'nav.reports', icon: 'description', link: '/ra/kpis' },
    {
      label: 'nav.laboratory',
      icon: 'science',
      link: '/laboratory',
      children: [
        { label: 'lab-profile.title', link: '/laboratory/lab-profile' },
        { label: 'staff-list.title', link: '/laboratory/staff-list' },
        { label: 'staff-form.title', link: '/laboratory/staff-form' },
        { label: 'product-catalog.title', link: '/laboratory/product-catalog' },
        { label: 'product-form.title', link: '/laboratory/product-form' },
        { label: 'raw-material-list.title', link: '/laboratory/raw-material-list' },
        {
          label: 'raw-material-form.title',
          icon: 'post_add',
          link: '/laboratory/raw-material-form',
        },
      ],
    },
  ];

  constructor(
    private router: Router,
    private observer: BreakpointObserver,
  ) {
    this.observer.observe(['(max-width: 768px)']).subscribe((result) => {
      if (result.matches) {
        this.sidenavMode = 'over';
        this.sidenavOpened = false;
      } else {
        this.sidenavMode = 'side';
        this.sidenavOpened = true;
      }
    });
  }

  navigateTo(link: string): void {
    this.router.navigate([link]).then();
    if (this.sidenavMode === 'over') {
      this.drawer.toggle().then();
    }
  }

  isActive(link: string): boolean {
    return this.router.url.startsWith(link);
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
