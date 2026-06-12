import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a payment attempt or completed payment for a subscription.
 *
 * @remarks
 * In Domain-Driven Design, Payment is an entity that records the financial
 * transaction associated with a subscription checkout process.
 */
export class Payment implements BaseEntity {
  /**
   * The unique numeric identifier of the payment.
   */
  id: number;

  /**
   * The numeric identifier of the related subscription.
   */
  subscriptionId: number;

  /**
   * The payment amount.
   */
  amount: number;

  /**
   * The payment currency.
   */
  currency: string;

  /**
   * The current status of the payment.
   */
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED';

  /**
   * The external payment provider name.
   */
  provider: string;

  /**
   * The external payment provider transaction identifier.
   */
  externalPaymentId?: string;

  /**
   * The ISO date string indicating when the payment was created.
   */
  createdAt: string;

  /**
   * Creates a new Payment entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    subscriptionId: number;
    amount: number;
    currency: string;
    status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED';
    provider: string;
    externalPaymentId?: string;
    createdAt: string;
  }) {
    this.id = params.id;
    this.subscriptionId = params.subscriptionId;
    this.amount = params.amount;
    this.currency = params.currency;
    this.status = params.status;
    this.provider = params.provider;
    this.externalPaymentId = params.externalPaymentId;
    this.createdAt = params.createdAt;
  }
}
