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

/**
 * Infrastructure service facade for Tracking and Telemetry external API operations.
 *
 * @remarks
 * In Domain-Driven Design, this service acts as the infrastructure layer facade
 * coordinating access to telemetry-related API resources through HTTP endpoints.
 * It orchestrates interactions between the application layer and the underlying
 * infrastructure endpoints for real-time measurements, equipment statuses, and historical data.
 *
 * The TrackingApi abstracts away the complexity of managing multiple endpoints,
 * providing a unified interface for application services to interact with
 * the telemetry domain data.
 */
@Injectable({ providedIn: 'root' })
export class TrackingApi extends BaseApi {
  private readonly _measurementEndpoint: MeasurementApiEndpoint;
  private readonly _equipmentStatusEndpoint: EquipmentStatusApiEndpoint;
  private readonly _telemetryHistoryEndpoint: TelemetryHistoryApiEndpoint;

  /**
   * Creates an instance of TrackingApi.
   *
   * @param http - Angular HttpClient for making HTTP requests
   *
   * @remarks
   * Initializes the API facade with specialized endpoint clients for measurements,
   * equipment statuses, and telemetry history. Each client manages its own
   * HTTP configuration and resource conversion.
   */
  constructor(http: HttpClient) {
    super();
    this._measurementEndpoint = new MeasurementApiEndpoint(http);
    this._equipmentStatusEndpoint = new EquipmentStatusApiEndpoint(http);
    this._telemetryHistoryEndpoint = new TelemetryHistoryApiEndpoint(http);
  }

  /**
   * Retrieves the latest raw telemetry measurements ingested by the system.
   *
   * @returns Observable stream emitting an array of Measurement domain entities
   */
  getLatestMeasurements(): Observable<Measurement[]> {
    return this._measurementEndpoint.getAll();
  }

  /**
   * Retrieves the real-time operational status for a specific piece of equipment.
   *
   * @param equipmentId - The unique numeric identifier of the equipment
   * @returns Observable stream emitting the EquipmentStatus domain entity
   */
  getEquipmentStatus(equipmentId: number): Observable<EquipmentStatus> {
    return this._equipmentStatusEndpoint.getStatusByEquipment(equipmentId);
  }

  /**
   * Retrieves a collection of historical telemetry data points based on provided criteria.
   *
   * @param filters - Optional object containing query parameters to filter the history logs
   * @param filters.equipmentId - Filter by the numeric identifier of specific equipment
   * @param filters.from - Start date and time for the telemetry query (ISO string format)
   * @param filters.to - End date and time for the telemetry query (ISO string format)
   * @returns Observable stream emitting an array of TelemetryHistoryPoint domain entities
   */
  getTelemetryHistory(filters?: {
    equipmentId?: number;
    from?: string;
    to?: string;
  }): Observable<TelemetryHistoryPoint[]> {
    return this._telemetryHistoryEndpoint.getTelemetryHistory(filters);
  }
}
