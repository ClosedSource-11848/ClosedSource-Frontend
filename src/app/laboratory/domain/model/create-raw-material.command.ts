export interface CreateRawMaterialCommand {
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
