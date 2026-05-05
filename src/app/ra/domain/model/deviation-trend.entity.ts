import { BaseEntity } from '../../../shared/domain/model/base-entity';

export interface DataPoint {
  timestamp: string;
  recordedValue: number;
  upperThreshold: number;
  lowerThreshold: number;
}

export class DeviationTrend implements BaseEntity {
  id: string;
  parameterName: string;
  equipmentId: string;
  trendDirection: 'STABLE' | 'INCREASING' | 'DECREASING';
  dataPoints: DataPoint[];

  constructor(params: {
    id: string;
    parameterName: string;
    equipmentId: string;
    trendDirection: 'STABLE' | 'INCREASING' | 'DECREASING';
    dataPoints: DataPoint[];
  }) {
    this.id = params.id;
    this.parameterName = params.parameterName;
    this.equipmentId = params.equipmentId;
    this.trendDirection = params.trendDirection;
    this.dataPoints = params.dataPoints;
  }
}
