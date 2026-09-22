import Stripe from 'stripe';
import { getStripe, isStripeConfigured, getStripePriceId } from '../config/stripe.js';
import { config } from '../config/index.js';
import { PlanType } from '../types/subscription.types.js';

export class StripeService {
  /**
   * Retrieves or creates a Stripe Customer mapped to the Supabase User ID.
   */
  async findOrCreateCustomer(userId: string, email: string, name?: string): Promise<string> {
    const isMockKey =
      !config.STRIPE_SECRET_KEY ||
      config.STRIPE_SECRET_KEY.includes('mock') ||
      config.STRIPE_SECRET_KEY.includes('placeholder') ||
      config.STRIPE_SECRET_KEY.includes('Mock');

    if (isMockKey) {
      return `cus_mock_${userId.replace(/-/g, '').slice(0, 14)}`;
    }

    const stripe = getStripe();

    // 1. Search for customer by metadata.user_id
    try {
      const searchResult = await stripe.customers.search({
        query: `metadata['user_id']:'${userId}'`,
        limit: 1
      });

      if (searchResult.data.length > 0) {
        return searchResult.data[0].id;
      }

      // 2. Create new customer with metadata
      const newCustomer = await stripe.customers.create({
        email,
        name: name || undefined,
        metadata: {
          user_id: userId
        }
      });

      return newCustomer.id;
    } catch (err: unknown) {
      // In dev fallback if search fails due to test key
      if ((err as Error).name === 'StripeAuthenticationError' || (err as Error).message.includes('API key')) {
        return `cus_mock_${userId.replace(/-/g, '').slice(0, 14)}`;
      }
      throw err;
    }
  }

  /**
   * Creates a Stripe Checkout Session for a subscription.
   */
  async createCheckoutSession(params: {
    userId: string;
    email: string;
    name?: string;
    planType: PlanType;
  }): Promise<{ sessionId: string; checkoutUrl: string }> {
    const { userId, email, name, planType } = params;

    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      const err = new Error(
        'Stripe is not configured in backend/.env. Please configure STRIPE_SECRET_KEY and price IDs.'
      );
      (err as unknown as { statusCode: number; code: string }).statusCode = 503;
      (err as unknown as { code: string }).code = 'STRIPE_NOT_CONFIGURED';
      throw err;
    }

    const isMockKey =
      config.STRIPE_SECRET_KEY.includes('mock') ||
      config.STRIPE_SECRET_KEY.includes('placeholder') ||
      config.STRIPE_SECRET_KEY.includes('Mock');

    if (isMockKey) {
      const mockSessionId = `cs_mock_${Date.now()}`;
      return {
        sessionId: mockSessionId,
        checkoutUrl: `${config.CLIENT_URL}/subscription/success?session_id=${mockSessionId}`
      };
    }

    const stripe = getStripe();
    const priceId = getStripePriceId(planType);

    if (!priceId) {
      const err = new Error(
        `Stripe Price ID for ${planType} plan is not configured. Please set STRIPE_${planType.toUpperCase()}_PRICE_ID in backend/.env.`
      );
      (err as unknown as { statusCode: number }).statusCode = 500;
      throw err;
    }

    const customerId = await this.findOrCreateCustomer(userId, email, name);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${config.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.CLIENT_URL}/subscription/cancel`,
      client_reference_id: userId,
      metadata: {
        user_id: userId,
        plan_type: planType
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_type: planType
        }
      }
    });

    if (!session.url) {
      throw new Error('Failed to generate Stripe checkout URL');
    }

    return {
      sessionId: session.id,
      checkoutUrl: session.url
    };
  }

  /**
   * Updates a Stripe subscription to cancel at the end of the current billing period.
   */
  async cancelSubscriptionAtPeriodEnd(stripeSubscriptionId: string): Promise<Stripe.Subscription> {
    const isMockKey =
      !config.STRIPE_SECRET_KEY ||
      config.STRIPE_SECRET_KEY.includes('mock') ||
      config.STRIPE_SECRET_KEY.includes('placeholder') ||
      config.STRIPE_SECRET_KEY.includes('Mock');

    if (isMockKey) {
      return {
        id: stripeSubscriptionId,
        cancel_at_period_end: true,
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 86400,
        canceled_at: Math.floor(Date.now() / 1000)
      } as unknown as Stripe.Subscription;
    }

    const stripe = getStripe();
    return await stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true
    });
  }

  /**
   * Reactivates a subscription that was scheduled to cancel at period end.
   */
  async reactivateSubscription(stripeSubscriptionId: string): Promise<Stripe.Subscription> {
    const isMockKey =
      !config.STRIPE_SECRET_KEY ||
      config.STRIPE_SECRET_KEY.includes('mock') ||
      config.STRIPE_SECRET_KEY.includes('placeholder') ||
      config.STRIPE_SECRET_KEY.includes('Mock');

    if (isMockKey) {
      return {
        id: stripeSubscriptionId,
        cancel_at_period_end: false,
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 86400,
        canceled_at: null
      } as unknown as Stripe.Subscription;
    }

    const stripe = getStripe();
    return await stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: false
    });
  }

  /**
   * Creates a Customer Portal session for billing management.
   */
  async createPortalSession(customerId: string, returnUrl: string): Promise<{ url: string }> {
    const isMockKey =
      !config.STRIPE_SECRET_KEY ||
      config.STRIPE_SECRET_KEY.includes('mock') ||
      config.STRIPE_SECRET_KEY.includes('placeholder') ||
      config.STRIPE_SECRET_KEY.includes('Mock');

    if (isMockKey) {
      return { url: `${config.CLIENT_URL}/subscription` };
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
      configuration: config.STRIPE_BILLING_PORTAL_CONFIGURATION_ID || undefined
    });

    return { url: session.url };
  }
}


export const stripeService = new StripeService();
