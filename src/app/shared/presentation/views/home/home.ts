import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';

/**
 * @summary Portal de inicio de QualiTrack (home view).
 * @remarks Pantalla principal presentada al usuario autenticado. Muestra
 * el logo de la plataforma, el mensaje de bienvenida y accesos directos
 * al Panel de Control (telemetría) y al Historial de Lotes, alineados
 * con el wireframe "Portal de Inicio - ClosedSource" del reporte AV1.
 * No contiene lógica de negocio ni consumo de stores.
 * @author QualiTrack
 */
@Component({
  selector: 'app-home',
  imports: [TranslatePipe, RouterLink, MatButton],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
