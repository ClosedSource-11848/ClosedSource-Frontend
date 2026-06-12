import { BaseResource } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a checkout session.
 *
 * @remarks
 * This resource represents the backend response after creating a checkout
 * session with a payment provider.
 */
export interface CheckoutSessionResource extends BaseResource {
  /**
   * External checkout session identifier.
   */
  checkoutSessionId: string;

  /**
   * URL where the user should be redirected to complete payment.
   */
  checkoutUrl: string;
}

/**
 * HTTP response contract for checkout session creation.
 */
export interface CheckoutSessionResponse extends BaseResource, CheckoutSessionResource {}
