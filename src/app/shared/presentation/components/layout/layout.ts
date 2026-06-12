import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LanguageSwitcher } from '../language-switcher/language-switcher';

/**
 * Layout component for the main application shell.
 *
 * @remarks
 * Provides the fixed toolbar, side navigation menu, language switcher,
 * and routed content outlet. Routes that require path parameters are excluded
 * from the menu to avoid navigating users to not-found pages.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    TranslateModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule,
    LanguageSwitcher,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  /**
   * Material sidenav display mode.
   */
  protected readonly sidenavMode: 'side' | 'over' = 'side';

  /**
   * Indicates whether the sidenav starts opened.
   */
  protected readonly sidenavOpened = true;

  /**
   * Navigation options rendered by the layout template.
   */
  protected readonly options = [
    {
      label: 'nav.dashboard',
      icon: 'dashboard',
      link: '/dashboard',
    },
    {
      label: 'nav.batches',
      icon: 'inventory',
      link: '/batches',
      children: [
        { label: 'batches.title', link: '/batches/batch-list' },
        { label: 'batches.add-button', link: '/batches/batch-form' },
      ],
    },
    {
      label: 'nav.equipment',
      icon: 'precision_manufacturing',
      link: '/equipments',
      children: [
        { label: 'equipment-list.title', link: '/equipments/equipment-list' },
        { label: 'equipment-list.add-button', link: '/equipments/register-equipment' },
      ],
    },
    {
      label: 'nav.alerts',
      icon: 'warning',
      link: '/alerts',
      children: [
        { label: 'ca-alerts.subtitle', link: '/alerts/alert-dashboard' },
        { label: 'ca-alerts.history.title', link: '/alerts/alert-history' },
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
        { label: 'lab-form.title', link: '/laboratories/lab-form' },
        { label: 'staff-list.title', link: '/laboratories/staff-list' },
        { label: 'staff-form.title', link: '/laboratories/staff-form' },
        { label: 'product-catalog.title', link: '/laboratories/product-catalog' },
        { label: 'product-form.title', link: '/laboratories/product-form' },
        { label: 'raw-material-list.title', link: '/laboratories/raw-material-list' },
        { label: 'raw-material-form.title', link: '/laboratories/raw-material-form' },
      ],
    },
    {
      label: 'nav.tracking',
      icon: 'sensors',
      link: '/tracking',
      children: [
        { label: 'tracking.dashboard.title', link: '/tracking/dashboard' },
        { label: 'tracking.history.title', link: '/tracking/history' },
        { label: 'tracking.analysis.title', link: '/tracking/analysis' },
      ],
    },
    {
      label: 'nav.subscription',
      icon: 'payments',
      link: '/subscriptions',
      children: [
        { label: 'subscription.billing.title', link: '/subscriptions/billing-summary' },
        { label: 'subscription.plans.title', link: '/subscriptions/plans' },
      ],
    },
  ];

  /**
   * Creates a new Layout component.
   *
   * @param router - Angular router used for navigation and active route checks
   */
  constructor(private readonly router: Router) {}

  /**
   * Navigates to a route from the side menu.
   *
   * @param link - Target route link
   */
  protected navigateTo(link: string): void {
    this.router.navigate([link]).then();
  }

  /**
   * Determines whether a route or route group is currently active.
   *
   * @param link - Route link to compare against the current URL
   * @returns True when the current URL matches or belongs to the route group
   */
  protected isActive(link: string): boolean {
    return this.router.url === link || this.router.url.startsWith(`${link}/`);
  }
}
