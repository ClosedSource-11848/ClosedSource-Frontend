/**
 * Command for creating a checkout session for a selected subscription plan.
 *
 * @remarks
 * This command belongs to the application layer. It is sent after the user is
 * authenticated so the backend can create a payment provider checkout session
 * associated with the current user and selected plan.
 */
export interface CreateCheckoutSessionCommand {
  /**
   * The business code of the selected subscription plan.
   */
  planCode: string;

  /**
   * The numeric identifier of the user who is starting checkout.
   */
  userId: number;

  /**
   * Optional laboratory identifier associated with the subscription.
   */
  laboratoryId?: number;
}
