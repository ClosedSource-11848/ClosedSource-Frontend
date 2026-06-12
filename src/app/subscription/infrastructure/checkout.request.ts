/**
 * Request payload for creating a subscription checkout session.
 *
 * @remarks
 * This request belongs to the infrastructure layer and represents the HTTP body
 * sent to the backend checkout endpoint.
 *
 * The frontend sends only identifiers and intent data. Pricing and payment
 * provider details must be resolved by the backend.
 */
export interface CreateCheckoutSessionRequest {
  /**
   * Business code of the selected subscription plan.
   */
  planCode: string;

  /**
   * Numeric identifier of the user starting checkout.
   */
  userId: number;

  /**
   * Optional laboratory identifier associated with the subscription.
   */
  laboratoryId?: number;
}
