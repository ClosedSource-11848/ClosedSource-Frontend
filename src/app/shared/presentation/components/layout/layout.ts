import { Component } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { FooterContent } from '../footer-content/footer-content';

/**
 * @summary Layout principal de la aplicación QualiTrack.
 * @remarks Componente raíz de presentación que define la estructura visual
 * global: toolbar de navegación superior con acceso a los módulos principales
 * (Dashboard, Lotes, Equipos, Alertas, Reportes, Configuración), selector de
 * idioma ES/EN, router-outlet para las vistas de cada bounded context y footer
 * corporativo. Las opciones de menú se alinean con los wireframes definidos:
 * Panel de Control, Ejecución de Lote, Estado de Equipos, Centro de Alertas,
 * Resumen de Calidad y Logs de Auditoría.
 * @author QualiTrack
 */
@Component({
  selector: 'app-layout',
  imports: [
    MatToolbar,
    MatToolbarRow,
    TranslatePipe,
    RouterLink,
    RouterLinkActive,
    MatButton,
    LanguageSwitcher,
    RouterOutlet,
    FooterContent,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  /**
   * Navigation options aligned with the QualiTrack wireframe screens:
   * - Dashboard
   * - Batches
   * - Equipment
   * - Alerts
   * - Compliance
   * - Reports
   */
  options = [
    { link: '/home', label: 'option.home' },
    { link: '/tracking/dashboard', label: 'option.dashboard' },
    { link: '/batch-management/batches', label: 'option.batches' },
    { link: '/equipment-management/equipment', label: 'option.equipment' },
    { link: '/compliance-alerting/alerts', label: 'option.alerts' },
    { link: '/reporting-audit/kpis', label: 'option.reports' },
    { link: '/laboratory-management/lab-profile', label: 'option.settings' },
  ];
}
