export const environment = {
  production: false,

  // Base API URL
  serverBasePath: 'http://localhost:8080/api/v1',

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
  caComplianceEndpointPath: '/compliance-events',
  caAlertsEndpointPath: '/alerts',
  caNotificationPrefsEndpointPath: '/notification-preferences',

  // RA (Reporting & Audit)
  raReportsEndpointPath: '/reports',
  raKpisEndpointPath: '/kpis',
  raAuditLogEndpointPath: '/audit-log',
  raDeviationTrendsEndpointPath: '/deviation-trends',

  // Payments
  subscriptionPlansEndpointPath: '/subscriptions/plans',
  subscriptionsEndpointPath: '/subscriptions',
  paymentsEndpointPath: '/subscriptions',
  checkoutEndpointPath: '/subscriptions/checkout-sessions',
};
