export interface UpdateNotificationPreferenceCommand {
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  minimumSeverity: string;
}
