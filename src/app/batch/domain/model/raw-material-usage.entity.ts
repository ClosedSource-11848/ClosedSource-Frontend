import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class RawMaterialUsage implements BaseEntity {
  id: string;
  batchId: string;
  rawMaterialId: string;
  rawMaterialName: string;
  quantityUsed: number;
  unit: string;
  usageDate: string;
  createdAt: string;

  constructor(params: {
    id: string;
    batchId: string;
    rawMaterialId: string;
    rawMaterialName: string;
    quantityUsed: number;
    unit: string;
    usageDate: string;
    createdAt: string;
  }) {
    this.id = params.id;
    this.batchId = params.batchId;
    this.rawMaterialId = params.rawMaterialId;
    this.rawMaterialName = params.rawMaterialName;
    this.quantityUsed = params.quantityUsed;
    this.unit = params.unit;
    this.usageDate = params.usageDate;
    this.createdAt = params.createdAt;
  }
}
