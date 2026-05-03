import { BaseResource } from '../../shared/infrastructure/base-response';

export interface LaboratoryResource extends BaseResource {
  name: string;
  ruc: string;
  address: string;
  phone: string;
  applicableRegulations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StaffMemberResource extends BaseResource {
  labId: string;
  fullName: string;
  role: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface PharmaceuticalProductResource extends BaseResource {
  labId: string;
  code: string;
  name: string;
  description: string;
  specifications: string;
  active: boolean;
  createdAt: string;
}

export interface RawMaterialResource extends BaseResource {
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
}
