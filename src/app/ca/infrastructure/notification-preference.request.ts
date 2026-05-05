export interface UpdateNotificationPreferenceRequest {
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  minimumSeverity: string;
}
