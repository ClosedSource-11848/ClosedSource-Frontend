import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { EquipmentApiEndpoint } from './equipment-api-endpoint';
import { BpmConfigApiEndpoint } from './bpm-config-api-endpoint';
import { MaintenanceApiEndpoint } from './maintenance-api-endpoint';
import { Equipment } from '../domain/model/equipment.entity';
import { BpmParameterConfig } from '../domain/model/bpm-parameter-config.entity';
import { MaintenanceRecord } from '../domain/model/maintenance-record.entity';

// Se corrigen los imports para usar el archivo único de requests del Bounded Context
import {
  RegisterEquipmentRequest,
  ConfigureBpmRequest,
  RegisterMaintenanceRequest,
} from './equipment.request';

@Injectable({ providedIn: 'root' })
export class EquipmentApi extends BaseApi {
  private readonly _equipmentEndpoint: EquipmentApiEndpoint;
  private readonly _bpmEndpoint: BpmConfigApiEndpoint;
  private readonly _maintenanceEndpoint: MaintenanceApiEndpoint;

  constructor(http: HttpClient) {
    super();
    // Inicialización de los endpoints modulares
    this._equipmentEndpoint = new EquipmentApiEndpoint(http);
    this._bpmEndpoint = new BpmConfigApiEndpoint(http);
    this._maintenanceEndpoint = new MaintenanceApiEndpoint(http);
  }

  // ── Equipment ───────────────────────────────────────────────────────────

  getEquipment(labId: string): Observable<Equipment[]> {
    return this._equipmentEndpoint.getEquipmentByLab(labId);
  }

  registerEquipment(request: RegisterEquipmentRequest): Observable<Equipment> {
    return this._equipmentEndpoint.registerEquipment(request);
  }

  // ── BPM Configuration ────────────────────────────────────────────────────

  /**
   * Obtiene la configuración de parámetros para un equipo específico.
   */
  getBpmConfig(equipmentId: string): Observable<BpmParameterConfig[]> {
    return this._bpmEndpoint.getConfigByEquipment(equipmentId);
  }

  /**
   * Crea una nueva configuración de parámetros BPM.
   */
  configureBpm(request: ConfigureBpmRequest): Observable<BpmParameterConfig> {
    return this._bpmEndpoint.configureBpm(request);
  }

  // ── Maintenance ──────────────────────────────────────────────────────────

  /**
   * Recupera el historial de mantenimientos de un equipo.
   */
  getMaintenanceHistory(equipmentId: string): Observable<MaintenanceRecord[]> {
    return this._maintenanceEndpoint.getMaintenanceHistory(equipmentId);
  }

  /**
   * Registra una nueva actividad de mantenimiento o calibración.
   */
  registerMaintenance(request: RegisterMaintenanceRequest): Observable<MaintenanceRecord> {
    return this._maintenanceEndpoint.registerMaintenance(request);
  }
}
