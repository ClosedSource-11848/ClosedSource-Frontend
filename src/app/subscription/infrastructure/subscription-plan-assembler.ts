import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import { SubscriptionPlanResource, SubscriptionPlansResponse } from './subscription-plan-response';

/**
 * Assembler for converting between subscription plan resources and domain entities.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class SubscriptionPlanAssembler implements BaseAssembler<
  SubscriptionPlan,
  SubscriptionPlanResource,
  SubscriptionPlansResponse
> {
  /**
   * Converts a subscription plans response into domain entities.
   *
   * @param response - API response containing plan resources
   * @returns Array of SubscriptionPlan domain entities
   */
  toEntitiesFromResponse(response: SubscriptionPlansResponse): SubscriptionPlan[] {
    return response.plans.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an array of plan resources into domain entities.
   *
   * @param resources - Array of plan resources
   * @returns Array of SubscriptionPlan domain entities
   */
  toEntitiesFromResources(resources: SubscriptionPlanResource[]): SubscriptionPlan[] {
    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts a plan resource into a domain entity.
   *
   * @param resource - Plan resource returned by the API
   * @returns SubscriptionPlan domain entity
   */
  toEntityFromResource(resource: SubscriptionPlanResource): SubscriptionPlan {
    return new SubscriptionPlan({
      id: resource.id,
      code: resource.code,
      name: resource.name,
      description: resource.description,
      priceAmount: resource.priceAmount,
      currency: resource.currency,
      billingPeriod: resource.billingPeriod,
      maxUsers: resource.maxUsers,
      maxEquipment: resource.maxEquipment,
      features: resource.features,
      active: resource.active,
    });
  }

  /**
   * Converts a domain entity into a plan resource.
   *
   * @param entity - SubscriptionPlan domain entity
   * @returns SubscriptionPlan resource
   */
  toResourceFromEntity(entity: SubscriptionPlan): SubscriptionPlanResource {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      priceAmount: entity.priceAmount,
      currency: entity.currency,
      billingPeriod: entity.billingPeriod,
      maxUsers: entity.maxUsers,
      maxEquipment: entity.maxEquipment,
      features: entity.features,
      active: entity.active,
    };
  }
}
