import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a customer subscription.
 *
 * @remarks
 * This resource belongs to the infrastructure layer and represents the
 * subscription data returned by the backend API.
 */
export interface SubscriptionResource extends BaseResource {
  /**
   * The unique numeric identifier of the subscription.
   */
  id: number;

  /**
   * The numeric identifier of the subscription owner.
   */
  userId: number;

  /**
   * The numeric identifier of the related laboratory, if available.
   */
  laboratoryId?: number;

  /**
   * The numeric identifier of the selected subscription plan.
   */
  planId: number;

  /**
   * Current lifecycle status of the subscription.
   */
  status: 'PENDING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';

  /**
   * ISO date string indicating when the subscription starts.
   */
  startedAt: string;

  /**
   * ISO date string indicating when the current billing period ends.
   */
  currentPeriodEndsAt?: string;
}

/**
 * Response envelope for subscription collection queries.
 */
export interface SubscriptionsResponse extends BaseResponse {
  /**
   * Array of subscription resources.
   */
  subscriptions: SubscriptionResource[];
}
