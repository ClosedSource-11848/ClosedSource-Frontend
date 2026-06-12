import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents an active or historical subscription owned by a user or laboratory.
 *
 * @remarks
 * In Domain-Driven Design, Subscription is an entity that tracks the lifecycle
 * of a customer's access to the platform. It connects a customer context with
 * a selected plan and its payment status.
 */
export class Subscription implements BaseEntity {
  /**
   * The unique numeric identifier of the subscription.
   */
  id: number;

  /**
   * The numeric identifier of the user who owns or manages the subscription.
   */
  userId: number;

  /**
   * The numeric identifier of the laboratory associated with the subscription.
   */
  laboratoryId?: number;

  /**
   * The numeric identifier of the selected subscription plan.
   */
  planId: number;

  /**
   * The current lifecycle status of the subscription.
   */
  status: 'PENDING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';

  /**
   * The ISO date string indicating when the subscription starts.
   */
  startedAt: string;

  /**
   * The ISO date string indicating when the current billing period ends.
   */
  currentPeriodEndsAt?: string;

  /**
   * Creates a new Subscription entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    userId: number;
    laboratoryId?: number;
    planId: number;
    status: 'PENDING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';
    startedAt: string;
    currentPeriodEndsAt?: string;
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.laboratoryId = params.laboratoryId;
    this.planId = params.planId;
    this.status = params.status;
    this.startedAt = params.startedAt;
    this.currentPeriodEndsAt = params.currentPeriodEndsAt;
  }
}
