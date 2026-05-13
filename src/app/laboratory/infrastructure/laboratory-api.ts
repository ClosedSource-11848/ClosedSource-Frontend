import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';

import { Laboratory } from '../domain/model/laboratory.entity';
import { StaffMember } from '../domain/model/staff-member.entity';
import { PharmaceuticalProduct } from '../domain/model/pharmaceutical-product.entity';
import { RawMaterial } from '../domain/model/raw-material.entity';

import { LaboratoryApiEndpoint } from './laboratory-api-endpoint';
import { StaffApiEndpoint } from './staff-api-endpoint';
import { ProductApiEndpoint } from './product-api-endpoint';
import { RawMaterialApiEndpoint } from './raw-material-api-endpoint';

import { UpdateLaboratoryRequest } from './laboratory.request';
import { RegisterStaffRequest } from './staff.request';
import { CreateProductRequest } from './product.request';
import { CreateRawMaterialRequest } from './raw-material.request';

/**
 * Unified API facade for all HTTP operations within the Laboratory domain.
 *
 * @remarks
 * `LaboratoryApi` acts as the single entry point for the presentation and
 * application layers to communicate with the remote API across all Laboratory
 * bounded context resources: laboratories, staff members, pharmaceutical
 * products, and raw materials.
 *
 * Internally it delegates each operation to a dedicated endpoint class
 * ({@link LaboratoryApiEndpoint}, {@link StaffApiEndpoint},
 * {@link ProductApiEndpoint}, {@link RawMaterialApiEndpoint}), keeping
 * HTTP concerns encapsulated and the facade interface clean.
 *
 * Provided at the root level and injectable anywhere in the application
 * without additional module configuration.
 *
 * @example
 * ```typescript
 * @Component({ ... })
 * export class LabDashboardComponent {
 *   constructor(private readonly labApi: LaboratoryApi) {}
 *
 *   loadDashboard(labId: string): void {
 *     this.labApi.getLaboratory(labId).subscribe(lab => console.log(lab.name));
 *     this.labApi.getStaff(labId).subscribe(staff => console.log(staff.length));
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class LaboratoryApi extends BaseApi {
  /** Endpoint handler for laboratory profile operations. */
  private readonly _laboratoryEndpoint: LaboratoryApiEndpoint;

  /** Endpoint handler for staff member operations. */
  private readonly _staffEndpoint: StaffApiEndpoint;

  /** Endpoint handler for pharmaceutical product operations. */
  private readonly _productsEndpoint: ProductApiEndpoint;

  /** Endpoint handler for raw material operations. */
  private readonly _materialsEndpoint: RawMaterialApiEndpoint;

  /**
   * Creates an instance of `LaboratoryApi` and initializes all endpoint handlers.
   *
   * @param http - The Angular `HttpClient` instance injected by the DI container,
   * forwarded to each endpoint handler to perform HTTP requests.
   *
   * @remarks
   * Each endpoint class is instantiated here rather than injected, centralizing
   * HTTP client propagation and keeping individual endpoint classes free of
   * Angular DI decoration.
   */
  constructor(http: HttpClient) {
    super();
    this._laboratoryEndpoint = new LaboratoryApiEndpoint(http);
    this._staffEndpoint = new StaffApiEndpoint(http);
    this._productsEndpoint = new ProductApiEndpoint(http);
    this._materialsEndpoint = new RawMaterialApiEndpoint(http);
  }

  // ── Laboratory ────────────────────────────────────────────────────────────

  /**
   * Retrieves the profile of a laboratory by its identifier.
   *
   * @param labId - The unique identifier of the laboratory to retrieve.
   * @returns An `Observable` that emits the matching {@link Laboratory} entity.
   */
  getLaboratory(labId: string): Observable<Laboratory> {
    return this._laboratoryEndpoint.getByLabId(labId);
  }

  /**
   * Updates the profile information of an existing laboratory.
   *
   * @param labId - The unique identifier of the laboratory to update.
   * @param request - The {@link UpdateLaboratoryRequest} payload containing
   * the new values for the laboratory's mutable fields.
   * @returns An `Observable` that emits the updated {@link Laboratory} entity
   * as returned by the server after applying the changes.
   */
  updateLaboratory(labId: string, request: UpdateLaboratoryRequest): Observable<Laboratory> {
    return this._laboratoryEndpoint.updateLaboratory(labId, request);
  }

  // ── Staff ─────────────────────────────────────────────────────────────────

  /**
   * Retrieves all staff members associated with a laboratory.
   *
   * @param labId - The unique identifier of the laboratory whose staff to retrieve.
   * @returns An `Observable` that emits an array of {@link StaffMember} entities
   * belonging to the specified laboratory.
   */
  getStaff(labId: string): Observable<StaffMember[]> {
    return this._staffEndpoint.getStaffByLab(labId);
  }

  /**
   * Registers a new staff member under a specific laboratory.
   *
   * @param labId - The unique identifier of the laboratory to register the staff member under.
   * @param request - The {@link RegisterStaffRequest} payload containing the
   * new staff member's profile information.
   * @returns An `Observable` that emits the newly created {@link StaffMember}
   * entity as returned by the server.
   */
  registerStaff(labId: string, request: RegisterStaffRequest): Observable<StaffMember> {
    return this._staffEndpoint.registerStaff(labId, request);
  }

  /**
   * Deactivates an existing staff member within a laboratory.
   *
   * @param labId - The unique identifier of the laboratory the staff member belongs to.
   * @param staffId - The unique identifier of the staff member to deactivate.
   * @returns An `Observable` that completes when the deactivation has been
   * successfully processed by the server.
   *
   * @remarks
   * Deactivation does not delete the record. It is retained for historical
   * traceability including authorship on past audit entries and batch approvals.
   * See {@link StaffMember.active} for details.
   */
  deactivateStaff(labId: string, staffId: string): Observable<void> {
    return this._staffEndpoint.deactivateStaff(labId, staffId);
  }

  // ── Products ──────────────────────────────────────────────────────────────

  /**
   * Retrieves all pharmaceutical products registered under a laboratory.
   *
   * @param labId - The unique identifier of the laboratory whose products to retrieve.
   * @returns An `Observable` that emits an array of {@link PharmaceuticalProduct}
   * entities belonging to the specified laboratory.
   */
  getProducts(labId: string): Observable<PharmaceuticalProduct[]> {
    return this._productsEndpoint.getProductsByLab(labId);
  }

  /**
   * Creates a new pharmaceutical product under a specific laboratory.
   *
   * @param labId - The unique identifier of the laboratory to register the product under.
   * @param request - The {@link CreateProductRequest} payload containing
   * the new product's details.
   * @returns An `Observable` that emits the newly created {@link PharmaceuticalProduct}
   * entity as returned by the server.
   */
  createProduct(labId: string, request: CreateProductRequest): Observable<PharmaceuticalProduct> {
    return this._productsEndpoint.createProduct(labId, request);
  }

  // ── Raw Materials ─────────────────────────────────────────────────────────

  /**
   * Retrieves all raw materials registered under a laboratory.
   *
   * @param labId - The unique identifier of the laboratory whose raw materials to retrieve.
   * @returns An `Observable` that emits an array of {@link RawMaterial} entities
   * belonging to the specified laboratory.
   */
  getRawMaterials(labId: string): Observable<RawMaterial[]> {
    return this._materialsEndpoint.getRawMaterialsByLab(labId);
  }

  /**
   * Retrieves all raw materials whose stock level is at or below their
   * defined minimum stock threshold.
   *
   * @param labId - The unique identifier of the laboratory to check for low-stock materials.
   * @returns An `Observable` that emits an array of {@link RawMaterial} entities
   * that require restocking attention.
   *
   * @remarks
   * Intended to support inventory monitoring and procurement alert workflows.
   * See {@link RawMaterial.minimumStock} for the threshold definition used to
   * determine low-stock status.
   */
  getLowStockMaterials(labId: string): Observable<RawMaterial[]> {
    return this._materialsEndpoint.getLowStockMaterials(labId);
  }

  /**
   * Creates a new raw material entry under a specific laboratory.
   *
   * @param labId - The unique identifier of the laboratory to register the material under.
   * @param request - The {@link CreateRawMaterialRequest} payload containing
   * the new material's inventory and traceability details.
   * @returns An `Observable` that emits the newly created {@link RawMaterial}
   * entity as returned by the server.
   */
  createRawMaterial(labId: string, request: CreateRawMaterialRequest): Observable<RawMaterial> {
    return this._materialsEndpoint.createRawMaterial(labId, request);
  }
}
