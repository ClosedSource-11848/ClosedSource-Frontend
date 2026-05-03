import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { LaboratoryApiEndpoint } from './laboratory-api-endpoint';
import { StaffApiEndpoint } from './staff-api-endpoint';
import { ProductApiEndpoint } from './product-api-endpoint';
import { RawMaterialApiEndpoint } from './raw-material-api-endpoint';
import { Laboratory } from '../domain/model/laboratory.entity';
import { StaffMember } from '../domain/model/staff-member.entity';
import { PharmaceuticalProduct } from '../domain/model/pharmaceutical-product.entity';
import { RawMaterial } from '../domain/model/raw-material.entity';
import { UpdateLaboratoryRequest } from './laboratory.request';
import { RegisterStaffRequest } from './laboratory.request';
import { CreateProductRequest } from './laboratory.request';
import { CreateRawMaterialRequest } from './laboratory.request';

@Injectable({ providedIn: 'root' })
export class LaboratoryApi extends BaseApi {
  private readonly _laboratoryEndpoint: LaboratoryApiEndpoint;
  private readonly _staffEndpoint: StaffApiEndpoint;
  private readonly _productsEndpoint: ProductApiEndpoint;
  private readonly _materialsEndpoint: RawMaterialApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this._laboratoryEndpoint = new LaboratoryApiEndpoint(http);
    this._staffEndpoint = new StaffApiEndpoint(http);
    this._productsEndpoint = new ProductApiEndpoint(http);
    this._materialsEndpoint = new RawMaterialApiEndpoint(http);
  }

  // ── Laboratory ───────────────────────────────────────────────────────────

  getLaboratory(labId: string): Observable<Laboratory> {
    return this._laboratoryEndpoint.getByLabId(labId);
  }

  updateLaboratory(labId: string, request: UpdateLaboratoryRequest): Observable<Laboratory> {
    return this._laboratoryEndpoint.updateLaboratory(labId, request);
  }

  // ── Staff ────────────────────────────────────────────────────────────────

  getStaff(labId: string): Observable<StaffMember[]> {
    return this._staffEndpoint.getStaffByLab(labId);
  }

  registerStaff(labId: string, request: RegisterStaffRequest): Observable<StaffMember> {
    return this._staffEndpoint.registerStaff(labId, request);
  }

  deactivateStaff(labId: string, staffId: string): Observable<void> {
    return this._staffEndpoint.deactivateStaff(labId, staffId);
  }

  // ── Products ─────────────────────────────────────────────────────────────

  getProducts(labId: string): Observable<PharmaceuticalProduct[]> {
    return this._productsEndpoint.getProductsByLab(labId);
  }

  createProduct(labId: string, request: CreateProductRequest): Observable<PharmaceuticalProduct> {
    return this._productsEndpoint.createProduct(labId, request);
  }

  // ── Raw Materials ────────────────────────────────────────────────────────

  getRawMaterials(labId: string): Observable<RawMaterial[]> {
    return this._materialsEndpoint.getRawMaterialsByLab(labId);
  }

  getLowStockMaterials(labId: string): Observable<RawMaterial[]> {
    return this._materialsEndpoint.getLowStockMaterials(labId);
  }

  createRawMaterial(labId: string, request: CreateRawMaterialRequest): Observable<RawMaterial> {
    return this._materialsEndpoint.createRawMaterial(labId, request);
  }
}
