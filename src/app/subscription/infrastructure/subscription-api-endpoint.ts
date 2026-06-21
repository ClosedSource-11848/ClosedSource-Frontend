import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import { Subscription } from '../domain/model/subscription.entity';
import { Payment } from '../domain/model/payment.entity';

import { SubscriptionPlanResource } from './subscription-plan-response';
import { SubscriptionResource } from './subscription-response';
import { PaymentResource } from './payment-response';
import { CreateCheckoutSessionRequest } from './checkout.request';
import { CheckoutSessionResource, CheckoutSessionResponse } from './checkout-response';

import { SubscriptionPlanAssembler } from './subscription-plan-assembler';
import { SubscriptionAssembler } from './subscription-assembler';
import { PaymentAssembler } from './payment-assembler';
import { CheckoutSessionAssembler } from './checkout-session-assembler';

const plansEndpointUrl = `${environment.serverBasePath}${environment.subscriptionPlansEndpointPath}`;
const subscriptionsEndpointUrl = `${environment.serverBasePath}${environment.subscriptionsEndpointPath}`;
const checkoutEndpointUrl = `${environment.serverBasePath}${environment.checkoutEndpointPath}`;

/**
 * HTTP endpoint client for subscription and payment operations.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer. It encapsulates all HTTP
 * communication related to subscription plans, active subscriptions, payment
 * history, and checkout session creation.
 */
export class SubscriptionApiEndpoint extends ErrorHandlingEnabledBaseType {
  /**
   * Assembler used to map subscription plan resources into domain entities.
   */
  private readonly planAssembler = new SubscriptionPlanAssembler();

  /**
   * Assembler used to map subscription resources into domain entities.
   */
  private readonly subscriptionAssembler = new SubscriptionAssembler();

  /**
   * Assembler used to map payment resources into domain entities.
   */
  private readonly paymentAssembler = new PaymentAssembler();

  /**
   * Assembler used to map checkout session responses into resources.
   */
  private readonly checkoutAssembler = new CheckoutSessionAssembler();

  /**
   * Creates a new SubscriptionApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to execute HTTP requests
   */
  constructor(private readonly http: HttpClient) {
    super();
  }

  /**
   * Retrieves all available subscription plans.
   *
   * @returns Observable stream emitting subscription plan domain entities
   */
  getPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlanResource[]>(plansEndpointUrl).pipe(
      map((resources) => this.planAssembler.toEntitiesFromResources(resources)),
      catchError(this.handleError('Failed to fetch subscription plans')),
    );
  }

  /**
   * Retrieves the active subscription for a laboratory.
   *
   * @param laboratoryId - Numeric identifier of the laboratory
   * @returns Observable stream emitting the active Subscription entity
   */
  getCurrentSubscription(laboratoryId: number): Observable<Subscription> {
    return this.http
      .get<SubscriptionResource>(`${subscriptionsEndpointUrl}/laboratories/${laboratoryId}/active`)
      .pipe(
        map((resource) => this.subscriptionAssembler.toEntityFromResource(resource)),
        catchError(this.handleError(`Failed to fetch subscription for laboratory ${laboratoryId}`)),
      );
  }

  /**
   * Retrieves payment history for a subscription.
   *
   * @param subscriptionId - Numeric identifier of the subscription
   * @returns Observable stream emitting payment domain entities
   */
  getPaymentsBySubscription(subscriptionId: number): Observable<Payment[]> {
    return this.http
      .get<PaymentResource[]>(`${subscriptionsEndpointUrl}/${subscriptionId}/payments`)
      .pipe(
        map((resources) => this.paymentAssembler.toEntitiesFromResources(resources)),
        catchError(this.handleError(`Failed to fetch payments for subscription ${subscriptionId}`)),
      );
  }

  /**
   * Creates a checkout session for the selected subscription plan.
   *
   * @param request - Request payload containing selected plan and user context
   * @returns Observable stream emitting checkout session resource
   */
  createCheckoutSession(
    request: CreateCheckoutSessionRequest,
  ): Observable<CheckoutSessionResource> {
    return this.http.post<CheckoutSessionResponse>(checkoutEndpointUrl, request).pipe(
      map((response) => this.checkoutAssembler.toResourceFromResponse(response)),
      catchError(this.handleError('Failed to create checkout session')),
    );
  }
}
