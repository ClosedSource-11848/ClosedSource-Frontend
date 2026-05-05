import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface NotificationPreferenceResource extends BaseResource {
  id: string;
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  minimumSeverity: string;
  createdAt: string;
}

export interface NotificationPreferencesResponse extends BaseResponse {
  preferences: NotificationPreferenceResource[];
}
