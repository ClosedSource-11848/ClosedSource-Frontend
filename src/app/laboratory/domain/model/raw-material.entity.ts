import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class RawMaterial implements BaseEntity {
  id: string;
  labId: string;
  name: string;
  code: string;
  supplier: string;
  batchNumber: string;
  expirationDate: string;
  quantityInStock: number;
  unit: string;
  minimumStock: number;
  createdAt: string;

  constructor(params: {
    id: string;
    labId: string;
    name: string;
    code: string;
    supplier: string;
    batchNumber: string;
    expirationDate: string;
    quantityInStock: number;
    unit: string;
    minimumStock: number;
    createdAt: string;
  }) {
    this.id = params.id;
    this.labId = params.labId;
    this.name = params.name;
    this.code = params.code;
    this.supplier = params.supplier;
    this.batchNumber = params.batchNumber;
    this.expirationDate = params.expirationDate;
    this.quantityInStock = params.quantityInStock;
    this.unit = params.unit;
    this.minimumStock = params.minimumStock;
    this.createdAt = params.createdAt;
  }
}
