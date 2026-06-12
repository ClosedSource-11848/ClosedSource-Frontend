import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a subscription plan for API communication.
 *
 * @remarks
 * This resource belongs to the infrastructure layer and represents the plan
 * data as returned by the backend subscription API.
 */
export interface SubscriptionPlanResource extends BaseResource {
  /**
   * The unique numeric identifier of the subscription plan.
   */
  id: number;

  /**
   * Stable business code of the plan.
   */
  code: string;

  /**
   * Display name of the plan.
   */
  name: string;

  /**
   * Short description of the plan.
   */
  description: string;

  /**
   * Plan price amount.
   */
  priceAmount: number;

  /**
   * Currency used for the plan price.
   */
  currency: string;

  /**
   * Billing period for the plan.
   */
  billingPeriod: 'MONTHLY' | 'YEARLY';

  /**
   * Maximum number of users allowed by the plan.
   */
  maxUsers: number;

  /**
   * Maximum number of equipment records allowed by the plan.
   */
  maxEquipment: number;

  /**
   * Features included in the plan.
   */
  features: string[];

  /**
   * Indicates whether the plan is available for purchase.
   */
  active: boolean;
}

/**
 * Response envelope for subscription plan collection queries.
 */
export interface SubscriptionPlansResponse extends BaseResponse {
  /**
   * Array of subscription plan resources.
   */
  plans: SubscriptionPlanResource[];
}
