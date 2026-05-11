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
    {
      label: 'nav.dashboard',
      icon: 'cast_connected',
      link: '/tracking',
      children: [
        { label: 'tracking.dashboard.title', link: '/tracking/dashboard' },
        { label: 'tracking.analysis.title', link: '/tracking/analysis' },
        { label: 'tracking.history.title', link: '/tracking/history' },
      ],
    },
    {
      label: 'nav.batches',
      icon: 'inventory_2',
      link: '/batches',
      children: [
        { label: 'batches.title', link: '/batches/batch-list' },
        { label: 'product-form.title', link: '/batches/batch-form' },
        { label: 'equipment-detail.title', link: '/batches/batch-detail' },
        { label: 'batches.actions.release', link: '/batches/batch-release-form' },
        { label: 'batches.actions.reject', link: '/batches/batch-reject-form' },
      ],
    },
    {
      label: 'nav.equipment',
      icon: 'settings_suggest',
      link: '/equipments',
      children: [
        { label: 'equipment-list.title', link: '/equipments/equipment-list' },
        { label: 'equipment-form.title', link: '/equipments/register-equipment' },
        { label: 'equipment-detail.title', link: '/equipments/equipment-detail' },
        { label: 'bpm-config.title', link: '/equipments/bpm-config-form' },
        { label: 'maintenance-history.title', link: '/equipments/maintenance-history' },
        { label: 'maintenance-form.title', link: '/equipments/maintenance-form' },
      ],
    },
    {
      label: 'nav.alerts',
      icon: 'warning',
      link: '/alerts',
      children: [
        { label: 'nav.dashboard', link: '/alerts/alert-dashboard' },
        { label: 'ca-alerts.history.title', link: '/alerts/alert-history' },
        { label: 'ca-alerts.detail.title', link: '/alerts/deviation-detail' },
        { label: 'ca-alerts.settings.title', link: '/alerts/notification-settings' },
      ],
    },
    {
      label: 'nav.reports',
      icon: 'description',
      link: '/reports',
      children: [
        { label: 'kpi-dashboard.title', link: '/reports/kpi-dashboard' },
        { label: 'deviation-trend.title', link: '/reports/deviation-trends' },
        { label: 'report-generator.title', link: '/reports/report-generator' },
        { label: 'audit-log.title', link: '/reports/audit-log' },
      ],
    },
    {
      label: 'nav.laboratory',
      icon: 'science',
      link: '/laboratories',
      children: [
        { label: 'lab-profile.title', link: '/laboratories/lab-profile' },
        { label: 'staff-list.title', link: '/laboratories/staff-list' },
        { label: 'staff-form.title', link: '/laboratories/staff-form' },
        { label: 'product-catalog.title', link: '/laboratories/product-catalog' },
        { label: 'product-form.title', link: '/laboratories/product-form' },
        { label: 'raw-material-list.title', link: '/laboratories/raw-material-list' },
        {
          label: 'raw-material-form.title',
          icon: 'post_add',
          link: '/laboratories/raw-material-form',
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
