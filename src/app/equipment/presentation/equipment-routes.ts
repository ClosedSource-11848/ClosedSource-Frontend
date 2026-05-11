import { Routes } from '@angular/router';
import { Layout } from '../../shared/presentation/components/layout/layout';

// Lazy loading de las vistas siguiendo el patrón del BC Laboratory
const equipmentList = () =>
  import('./views/equipment-list/equipment-list').then((m) => m.EquipmentList);

const equipmentForm = () =>
  import('./views/equipment-form/equipment-form').then((m) => m.EquipmentForm);

const equipmentDetail = () =>
  import('./views/equipment-detail/equipment-detail').then((m) => m.EquipmentDetail);

const bpmConfigForm = () =>
  import('./views/bpm-config-form/bpm-config-form').then((m) => m.BpmConfigForm);

const maintenanceHistory = () =>
  import('./views/maintenance-history/maintenance-history').then((m) => m.MaintenanceHistory);

const maintenanceForm = () =>
  import('./views/maintenance-form/maintenance-form').then((m) => m.MaintenanceForm);

const equipmentRoutes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'equipment-list', loadComponent: equipmentList },
      { path: 'register-equipment', loadComponent: equipmentForm },
      { path: 'equipment-detail/:id', loadComponent: equipmentDetail },
      { path: 'bpm-config-form/:id', loadComponent: bpmConfigForm },
      { path: 'maintenance-history/:id', loadComponent: maintenanceHistory },
      { path: 'maintenance-form/:id', loadComponent: maintenanceForm },
      { path: '', redirectTo: 'equipment-list', pathMatch: 'full' },
    ],
  },
];

export { equipmentRoutes };
