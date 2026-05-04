export const environment = {
  production: true,

  // Base API URL
  serverBasePath: 'http://localhost:8080/api/v1',

  // IAM (Identity and Access Management)
  iamSignInEndpointPath: '/auth/sign-in',
  iamSignUpEndpointPath: '/auth/sign-up',
  iamRecoverPasswordEndpointPath: '/auth/recover-password',

  // Laboratory
  laboratoryLabsEndpointPath: '/labs',
  laboratoryStaffEndpointPath: '/staff',
  laboratoryProductsEndpointPath: '/products',
  laboratoryRawMaterialsEndpointPath: '/raw-materials',

  // Equipment
  equipmentEndpointPath: '/equipment',
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
