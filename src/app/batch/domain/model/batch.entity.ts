import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Batch implements BaseEntity {
  id: string;
  labId: string;
  productId: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RELEASED' | 'REJECTED';
  startDate: string;
  endDate?: string;
  notes?: string;
  createdAt: string;

  constructor(params: {
    id: string;
    labId: string;
    productId: string;
    productName: string;
    batchNumber: string;
    quantity: number;
    unit: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'RELEASED' | 'REJECTED';
    startDate: string;
    endDate?: string;
    notes?: string;
    createdAt: string;
  }) {
    this.id = params.id;
    this.labId = params.labId;
    this.productId = params.productId;
    this.productName = params.productName;
    this.batchNumber = params.batchNumber;
    this.quantity = params.quantity;
    this.unit = params.unit;
    this.status = params.status;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.notes = params.notes;
    this.createdAt = params.createdAt;
  }
}
