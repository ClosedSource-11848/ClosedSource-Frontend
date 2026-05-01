import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * @summary Footer global de la aplicación QualiTrack.
 * @remarks Componente de presentación reutilizable que muestra el copyright
 * y los créditos tecnológicos de la plataforma. Se ubica en la parte inferior
 * de todas las vistas a través del Layout. No contiene lógica de negocio.
 * @author Ruiz Madrid, Billy Jake
 */
@Component({
  selector: 'app-footer-content',
  imports: [TranslatePipe],
  templateUrl: './footer-content.html',
  styleUrl: './footer-content.css',
})
export class FooterContent {}
