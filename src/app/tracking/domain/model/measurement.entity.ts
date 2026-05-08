import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Measurement implements BaseEntity {
    id: string;
    equipmentId: string;
    parameterName: string;
    value: number;
    unit: string;
    timestamp: string;
    createdAt: string;

    constructor(params: {
        id: string;
        equipmentId: string;
        parameterName: string;
        value: number;
        unit: string;
        timestamp: string;
        createdAt: string;
    }) {
        this.id = params.id;
        this.equipmentId = params.equipmentId;
        this.parameterName = params.parameterName;
        this.value = params.value;
        this.unit = params.unit;
        this.timestamp = params.timestamp;
        this.createdAt = params.createdAt;
    }
}
