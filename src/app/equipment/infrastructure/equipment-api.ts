import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';

import { Equipment } from '../domain/model/equipment.entity';
import { BpmParameterConfig } from '../domain/model/bpm-parameter-config.entity';
import { MaintenanceRecord } from '../domain/model/maintenance-record.entity';

import { EquipmentApiEndpoint } from './equipment-api-endpoint';
import { BpmConfigApiEndpoint } from './bpm-config-api-endpoint';
import { MaintenanceApiEndpoint } from './maintenance-api-endpoint';

import { RegisterEquipmentRequest } from './equipment.request';
import { ConfigureBpmRequest } from './bpm-config.request';
import { RegisterMaintenanceRequest } from './maintenance.request';

/**
 * Facade service for equipment-related API operations.
 *
 * @remarks
 * This service acts as the main access point for the equipment module at the
 * infrastructure level. It centralizes operations related to equipment
 * registration, BPM parameter configuration, and maintenance history.
 *
 * Instead of exposing each API endpoint directly to the rest of the application,
 * this class coordinates the different endpoint classes and provides a simpler
 * interface for consuming equipment-related use cases.
 *
 * In an Angular application, this service is provided at the root level, allowing
 * it to be injected and reused across components, services, or application
 * workflows that require equipment management operations.
 *
 * @example
 * ```typescript
 * equipmentApi.getEquipment('lab-001').subscribe((equipmentList) => {
 *   console.log(equipmentList);
 * });
 *
 * equipmentApi.configureBpm({
 *   equipmentId: 'equipment-001',
 *   parameterName: 'Temperature',
 *   minValue: 20,
 *   maxValue: 80,
 *   unit: '°C'
 * }).subscribe((config) => {
 *   console.log(config);
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class EquipmentApi extends BaseApi {
  /**
   * API endpoint responsible for equipment registration and retrieval.
   *
   * @remarks
   * This endpoint handles operations related to equipment records, such as
   * retrieving equipment by laboratory and registering new equipment.
   */
  private readonly _equipmentEndpoint: EquipmentApiEndpoint;

  /**
   * API endpoint responsible for BPM parameter configuration.
   *
   * @remarks
   * This endpoint manages the retrieval and configuration of acceptable BPM
   * parameter ranges associated with equipment.
   */
  private readonly _bpmEndpoint: BpmConfigApiEndpoint;

  /**
   * API endpoint responsible for maintenance records.
   *
   * @remarks
   * This endpoint handles operations related to equipment maintenance history
   * and maintenance registration.
   */
  private readonly _maintenanceEndpoint: MaintenanceApiEndpoint;

  /**
   * Creates a new EquipmentApi service instance.
   *
   * @param http - Angular HttpClient used to initialize the equipment,
   * BPM configuration, and maintenance API endpoints.
   *
   * @remarks
   * The constructor initializes the internal endpoint instances required to
   * execute all equipment-related HTTP operations.
   */
  constructor(http: HttpClient) {
    super();
    this._equipmentEndpoint = new EquipmentApiEndpoint(http);
    this._bpmEndpoint = new BpmConfigApiEndpoint(http);
    this._maintenanceEndpoint = new MaintenanceApiEndpoint(http);
  }

  // ── Equipment ───────────────────────────────────────────────────────────

  /**
   * Retrieves the equipment registered in a specific laboratory.
   *
   * @param labId - The identifier of the laboratory.
   * @returns An Observable containing a list of Equipment entities.
   *
   * @remarks
   * This method delegates the request to EquipmentApiEndpoint and returns
   * the equipment associated with the provided laboratory identifier.
   */
  getEquipment(labId: string): Observable<Equipment[]> {
    return this._equipmentEndpoint.getEquipmentByLab(labId);
  }

  /**
   * Registers a new equipment in the system.
   *
   * @param request - The request data required to register the equipment.
   * @returns An Observable containing the registered Equipment entity.
   *
   * @remarks
   * This method delegates the equipment registration process to
   * EquipmentApiEndpoint. The request contains the laboratory assignment,
   * equipment name, type, model, and serial number.
   */
  registerEquipment(request: RegisterEquipmentRequest): Observable<Equipment> {
    return this._equipmentEndpoint.registerEquipment(request);
  }

  // ── BPM Configuration ────────────────────────────────────────────────────

  /**
   * Retrieves the BPM parameter configuration for a specific equipment.
   *
   * @param equipmentId - The identifier of the equipment.
   * @returns An Observable containing a list of BpmParameterConfig entities.
   *
   * @remarks
   * This method obtains the configured parameter limits associated with an
   * equipment, such as minimum value, maximum value, and measurement unit.
   */
  getBpmConfig(equipmentId: string): Observable<BpmParameterConfig[]> {
    return this._bpmEndpoint.getConfigByEquipment(equipmentId);
  }

  /**
   * Configures BPM parameter limits for an equipment.
   *
   * @param request - The request data required to configure BPM parameters.
   * @returns An Observable containing the created or updated BpmParameterConfig entity.
   *
   * @remarks
   * This method delegates the BPM configuration process to BpmConfigApiEndpoint.
   * It is used to define valid operating ranges for measurable parameters
   * associated with an equipment.
   */
  configureBpm(request: ConfigureBpmRequest): Observable<BpmParameterConfig> {
    return this._bpmEndpoint.configureBpm(request);
  }

  // ── Maintenance ──────────────────────────────────────────────────────────

  /**
   * Retrieves the maintenance history of a specific equipment.
   *
   * @param equipmentId - The identifier of the equipment.
   * @returns An Observable containing a list of MaintenanceRecord entities.
   *
   * @remarks
   * This method obtains all maintenance records associated with the given
   * equipment, allowing the application to display historical maintenance
   * activities, inspections, calibrations, or corrective actions.
   */
  getMaintenanceHistory(equipmentId: string): Observable<MaintenanceRecord[]> {
    return this._maintenanceEndpoint.getMaintenanceHistory(equipmentId);
  }

  /**
   * Registers a new maintenance activity for an equipment.
   *
   * @param request - The request data required to register the maintenance record.
   * @returns An Observable containing the created MaintenanceRecord entity.
   *
   * @remarks
   * This method delegates the maintenance registration process to
   * MaintenanceApiEndpoint. The request includes the equipment identifier,
   * maintenance date, technician name, description, and maintenance type.
   */
  registerMaintenance(request: RegisterMaintenanceRequest): Observable<MaintenanceRecord> {
    return this._maintenanceEndpoint.registerMaintenance(request);
  }
}
