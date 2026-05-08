import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Measurement } from '../domain/model/measurement.entity';
import { EquipmentStatus } from '../domain/model/equipment-status.entity';
import { TelemetryHistoryPoint } from '../domain/model/telemetry-history-point.entity';
import { MeasurementApiEndpoint } from './measurement-api-endpoint';
import { EquipmentStatusApiEndpoint } from './equipment-status-api-endpoint';
import { TelemetryHistoryApiEndpoint } from './telemetry-history-api-endpoint';

@Injectable({ providedIn: 'root' })
export class TrackingApi extends BaseApi {
  private readonly _measurementEndpoint: MeasurementApiEndpoint;
  private readonly _equipmentStatusEndpoint: EquipmentStatusApiEndpoint;
  private readonly _telemetryHistoryEndpoint: TelemetryHistoryApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this._measurementEndpoint = new MeasurementApiEndpoint(http);
    this._equipmentStatusEndpoint = new EquipmentStatusApiEndpoint(http);
    this._telemetryHistoryEndpoint = new TelemetryHistoryApiEndpoint(http);
  }

  getLatestMeasurements(): Observable<Measurement[]> {
    return this._measurementEndpoint.getAll();
  }

  getEquipmentStatus(equipmentId: string): Observable<EquipmentStatus> {
    return this._equipmentStatusEndpoint.getStatusByEquipment(equipmentId);
  }

  getTelemetryHistory(filters?: {
    equipmentId?: string;
    from?: string;
    to?: string;
  }): Observable<TelemetryHistoryPoint[]> {
    return this._telemetryHistoryEndpoint.getTelemetryHistory(filters);
  }
}
