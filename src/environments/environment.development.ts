export const environment = {
  production: false,

  // Base API URL
  serverBasePath: 'https://qualitrack-v1.free.beeceptor.com/api/v1',

  // IAM (Identity and Access Management)
  iamSignInEndpointPath: '/authentication/sign-in',
  iamSignUpEndpointPath: '/authentication/sign-up',
  iamRecoverPasswordEndpointPath: '/authentication/recover-password',

  // Laboratory
  laboratoryLabsEndpointPath: '/labs',
  laboratoryStaffEndpointPath: '/staff',
  laboratoryProductsEndpointPath: '/products',
  laboratoryRawMaterialsEndpointPath: '/raw-materials',

  // Equipment
  equipmentEndpointPath: '/equipments',
  equipmentBpmConfigEndpointPath: '/bpm-config',
  equipmentMaintenanceEndpointPath: '/maintenance',

  // Batch
  batchEndpointPath: '/batches',
  batchRawMaterialUsageEndpointPath: '/raw-material-usages',

  // Tracking (IoT)
  trackingTelemetryEndpointPath: 'https://qt-telemetry-v3.free.beeceptor.com',
  //trackingTelemetryEndpointPath: '/telemetry',
  trackingDeviceBindingsEndpointPath: '/device-bindings',

  // CA (Compliance & Alerting)
  caComplianceEndpointPath: '/compliance',
  caAlertsEndpointPath: '/alerts',
  caNotificationPrefsEndpointPath: '/notification-preferences',

  // RA (Reporting & Audit)
  raReportsEndpointPath: '/reports',
  raKpisEndpointPath: '/kpis',
  raAuditLogEndpointPath: '/audit-log',
  raDeviationTrendsEndpointPath: '/deviation-trends',
};
