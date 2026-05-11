import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';

const about = () => import('./shared/presentation/views/about/about').then((m) => m.About);

const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound);

const laboratoryRoutes = () =>
  import('./laboratory/presentation/laboratory-routes').then((m) => m.laboratoryRoutes);

const iamRoutes = () => import('./iam/presentation/iam.routes').then((m) => m.iamRoutes);

const equipmentRoutes = () =>
  import('./equipment/presentation/equipment-routes').then((m) => m.equipmentRoutes);

const batchRoutes = () => import('./batch/presentation/batch-routes').then((m) => m.batchRoutes);

const caRoutes = () => import('./ca/presentation/ca-routes').then((m) => m.caRoutes);

const raRoutes = () => import('./ra/presentation/ra-routes').then((m) => m.raRoutes);

const trackingRoutes = () =>
  import('./tracking/presentation/tracking-routes').then((m) => m.trackingRoutes);


const baseTitle = 'QualiTrack';

export const routes: Routes = [
  { path: 'home', component: Home, title: `Home - ${baseTitle}` },
  { path: 'about', loadComponent: about, title: `About - ${baseTitle}` },
  { path: 'iam', loadChildren: iamRoutes },
  { path: 'laboratories', loadChildren: laboratoryRoutes },
  { path: 'equipments', loadChildren: equipmentRoutes },
  { path: 'batches', loadChildren: batchRoutes },
  { path: 'alerts', loadChildren: caRoutes },
  { path: 'reports', loadChildren: raRoutes },
  { path: 'tracking', loadChildren: trackingRoutes },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', loadComponent: pageNotFound, title: `Page Not Found - ${baseTitle}` },
];
