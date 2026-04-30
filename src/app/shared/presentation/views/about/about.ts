import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * @summary Vista "Acerca de" de QualiTrack.
 * @remarks Muestra información institucional sobre la plataforma QualiTrack
 * y el equipo ClosedSource. Utiliza ngx-translate para mostrar el contenido
 * en el idioma seleccionado. No contiene lógica de negocio.
 * @author Ruiz Madrid, Billy Jake
 */
@Component({
  selector: 'app-about',
  imports: [TranslatePipe],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {}
