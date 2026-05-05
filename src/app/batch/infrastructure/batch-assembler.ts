import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Batch } from '../domain/model/batch.entity';
import { BatchResource, BatchesResponse } from './batch-response';

export class BatchAssembler implements BaseAssembler<Batch, BatchResource, BatchesResponse> {
  toEntitiesFromResponse(response: BatchesResponse): Batch[] {
    return response.batches.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: BatchResource): Batch {
    return new Batch({
      id: resource.id,
      labId: resource.labId,
      productId: resource.productId,
      productName: resource.productName,
      batchNumber: resource.batchNumber,
      quantity: resource.quantity,
      unit: resource.unit,
      status: resource.status as any,
      startDate: resource.startDate,
      endDate: resource.endDate,
      notes: resource.notes,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: Batch): BatchResource {
    return {
      id: entity.id,
      labId: entity.labId,
      productId: entity.productId,
      productName: entity.productName,
      batchNumber: entity.batchNumber,
      quantity: entity.quantity,
      unit: entity.unit,
      status: entity.status,
      startDate: entity.startDate,
      endDate: entity.endDate,
      notes: entity.notes,
      createdAt: entity.createdAt,
    } as BatchResource;
  }
}
