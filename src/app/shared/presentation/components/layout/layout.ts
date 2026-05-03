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

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
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
    { label: 'nav.home', icon: 'home', link: '/home', color: '#148f77' },
    { label: 'nav.dashboard', icon: 'analytics', link: '/tracking/dashboard', color: '#148f77' },
    { label: 'nav.batches', icon: 'inventory_2', link: '/batch/batches', color: '#148f77' },
    { label: 'nav.equipment', icon: 'settings_suggest', link: '/equipment', color: '#148f77' },
    { label: 'nav.alerts', icon: 'warning', link: '/ca/alerts', color: '#148f77' },
    { label: 'nav.reports', icon: 'description', link: '/ra/kpis', color: '#148f77' },
    { label: 'nav.laboratory', icon: 'science', link: '/laboratory/lab-profile', color: '#148f77' },
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
