import { Routes } from '@angular/router';
import { Layout } from '../../shared/presentation/components/layout/layout';

// Lazy loading de las vistas siguiendo el patrón del BC Laboratory y Equipment
const batchList = () =>
  import('./views/batch-list/batch-list').then((m) => m.BatchList);

const batchForm = () =>
  import('./views/batch-form/batch-form').then((m) => m.BatchForm);

const batchDetail = () =>
  import('./views/batch-detail/batch-detail').then((m) => m.BatchDetail);

const batchReleaseForm = () =>
  import('./views/batch-release-form/batch-release-form').then(
    (m) => m.BatchReleaseForm,
  );

const batchRejectForm = () =>
  import('./views/batch-reject-form/batch-reject-form').then((m) => m.BatchRejectForm);

const batchRoutes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'batch-list', loadComponent: batchList },
      { path: 'batch-form', loadComponent: batchForm },
      { path: 'batch-detail/:id', loadComponent: batchDetail },
      { path: 'batch-release-form/:id', loadComponent: batchReleaseForm },
      { path: 'batch-reject-form/:id', loadComponent: batchRejectForm },
      { path: '', redirectTo: 'batch-list', pathMatch: 'full' },
    ],
  },
];

export { batchRoutes };
