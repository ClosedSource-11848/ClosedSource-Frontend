import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { NotificationPreference } from '../domain/model/notification-preference.entity';
import {
  NotificationPreferenceResource,
  NotificationPreferencesResponse,
} from './notification-preference-response';

export class NotificationPreferenceAssembler implements BaseAssembler<
  NotificationPreference,
  NotificationPreferenceResource,
  NotificationPreferencesResponse
> {
  toEntitiesFromResponse(response: NotificationPreferencesResponse): NotificationPreference[] {
    return response.preferences.map((pref) => this.toEntityFromResource(pref));
  }

  toEntityFromResource(resource: NotificationPreferenceResource): NotificationPreference {
    return new NotificationPreference({
      id: resource.id,
      userId: resource.userId,
      emailEnabled: resource.emailEnabled,
      smsEnabled: resource.smsEnabled,
      inAppEnabled: resource.inAppEnabled,
      minimumSeverity: resource.minimumSeverity,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: NotificationPreference): NotificationPreferenceResource {
    return {
      id: entity.id,
      userId: entity.userId,
      emailEnabled: entity.emailEnabled,
      smsEnabled: entity.smsEnabled,
      inAppEnabled: entity.inAppEnabled,
      minimumSeverity: entity.minimumSeverity,
      createdAt: entity.createdAt,
    } as NotificationPreferenceResource;
  }
}
