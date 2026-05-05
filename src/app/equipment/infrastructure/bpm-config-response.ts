import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface BpmConfigResource extends BaseResource {
  id: string;
  equipmentId: string;
  parameterName: string;
  minValue: number;
  maxValue: number;
  unit: string;
  createdAt: string;
}

export interface BpmConfigsResponse extends BaseResponse {
  bpmConfigs: BpmConfigResource[];
}
