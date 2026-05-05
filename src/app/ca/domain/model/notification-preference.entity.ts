import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class NotificationPreference implements BaseEntity {
  id: string;
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  minimumSeverity: string;
  createdAt: string;

  constructor(params: {
    id: string;
    userId: string;
    emailEnabled: boolean;
    smsEnabled: boolean;
    inAppEnabled: boolean;
    minimumSeverity: string;
    createdAt: string;
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.emailEnabled = params.emailEnabled;
    this.smsEnabled = params.smsEnabled;
    this.inAppEnabled = params.inAppEnabled;
    this.minimumSeverity = params.minimumSeverity;
    this.createdAt = params.createdAt;
  }
}
