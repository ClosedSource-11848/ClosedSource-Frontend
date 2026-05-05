import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface ComplianceEventResource extends BaseResource {
  id: string;
  relatedEntityId: string;
  eventType: string;
  description: string;
  timestamp: string;
  resolvedBy?: string;
  createdAt: string;
}

export interface ComplianceEventsResponse extends BaseResponse {
  complianceEvents: ComplianceEventResource[];
}
