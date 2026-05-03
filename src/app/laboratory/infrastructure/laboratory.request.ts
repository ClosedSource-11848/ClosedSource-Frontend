export interface UpdateLaboratoryRequest {
  name: string;
  address: string;
  phone: string;
  applicableRegulations: string[];
}

export interface RegisterStaffRequest {
  labId: string;
  fullName: string;
  role: string;
  email: string;
}

export interface CreateProductRequest {
  labId: string;
  code: string;
  name: string;
  description: string;
  specifications: string;
}

export interface CreateRawMaterialRequest {
  labId: string;
  name: string;
  code: string;
  supplier: string;
  batchNumber: string;
  expirationDate: string;
  quantityInStock: number;
  unit: string;
  minimumStock: number;
}
