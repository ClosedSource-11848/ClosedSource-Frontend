import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of an equipment's operational status for API communication.
 *
 * @remarks
 * In DDD, this acts as the infrastructure-level contract that represents
 * the real-time telemetry status data as it appears in HTTP responses. It bridges
 * the gap between external API consumers and the internal EquipmentStatus entity.
 */
export interface EquipmentStatusResource extends BaseResource {
  /**
   * The unique numeric identifier for the equipment status resource.
   */
  id: number;

  /**
   * The numeric identifier of the equipment this status belongs to.
   */
  equipmentId: number;

  /**
   * Indicates whether the equipment is currently actively communicating with the network.
   */
  isOnline: boolean;

  /**
   * The string representation of the evaluated telemetry health state (e.g., 'OPERATIONAL', 'WARNING').
   */
  currentStatus: string;

  /**
   * The exact timestamp of the last successfully received communication from the equipment.
   */
  lastHeartbeat: string;

  /**
   * The timestamp when this status record was created or registered in the system.
   */
  createdAt: string;
}

/**
 * Response envelope for equipment status collection queries.
 *
 * @remarks
 * This interface defines the structure of API responses that return multiple equipment statuses.
 * It allows for consistent metadata handling across collection endpoints.
 */
export interface EquipmentStatusesResponse extends BaseResponse {
  /**
   * Array of equipment status resources included in the response.
   */
  statuses: EquipmentStatusResource[];
}
