export const environment = {
  production: true,

  // Base API URL
  serverBasePath: 'https://qualitrack-v1.free.beeceptor.com/api/v1',

  // IAM (Identity and Access Management)
  iamSignInEndpointPath: '/authentication/sign-in',
  iamSignUpEndpointPath: '/authentication/sign-up',
  iamRecoverPasswordEndpointPath: '/authentication/recover-password',

  // Laboratory
  laboratoryLabsEndpointPath: '/laboratories',
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
  trackingTelemetryEndpointPath: '/telemetry',
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
