import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class BpmParameterConfig implements BaseEntity {
  id: string;
  equipmentId: string;
  parameterName: string;
  minValue: number;
  maxValue: number;
  unit: string;
  createdAt: string;

  constructor(params: {
    id: string;
    equipmentId: string;
    parameterName: string;
    minValue: number;
    maxValue: number;
    unit: string;
    createdAt: string;
  }) {
    this.id = params.id;
    this.equipmentId = params.equipmentId;
    this.parameterName = params.parameterName;
    this.minValue = params.minValue;
    this.maxValue = params.maxValue;
    this.unit = params.unit;
    this.createdAt = params.createdAt;
  }
}
