import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { ComplianceEvent } from '../domain/model/compliance-event.entity';
import { ComplianceEventResource, ComplianceEventsResponse } from './compliance-event-response';

export class ComplianceEventAssembler implements BaseAssembler<
  ComplianceEvent,
  ComplianceEventResource,
  ComplianceEventsResponse
> {
  toEntitiesFromResponse(response: ComplianceEventsResponse): ComplianceEvent[] {
    return response.complianceEvents.map((event) => this.toEntityFromResource(event));
  }

  toEntityFromResource(resource: ComplianceEventResource): ComplianceEvent {
    return new ComplianceEvent({
      id: resource.id,
      relatedEntityId: resource.relatedEntityId,
      eventType: resource.eventType,
      description: resource.description,
      timestamp: resource.timestamp,
      resolvedBy: resource.resolvedBy,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: ComplianceEvent): ComplianceEventResource {
    return {
      id: entity.id,
      relatedEntityId: entity.relatedEntityId,
      eventType: entity.eventType,
      description: entity.description,
      timestamp: entity.timestamp,
      resolvedBy: entity.resolvedBy,
      createdAt: entity.createdAt,
    } as ComplianceEventResource;
  }
}
