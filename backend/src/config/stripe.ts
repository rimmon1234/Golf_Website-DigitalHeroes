import Stripe from 'stripe';
import { config } from './index.js';

let stripeClient: Stripe | null = null;

/**
 * Checks if Stripe secret key is configured in the environment.
 */
export const isStripeConfigured = (): boolean => {
  return Boolean(config.STRIPE_SECRET_KEY && config.STRIPE_SECRET_KEY.startsWith('sk_'));
};

/**
 * Returns the singleton Stripe client. Throws error if Stripe is not configured.
 */
export const getStripe = (): Stripe => {
  if (!stripeClient) {
    if (!isStripeConfigured()) {
      const error = new Error('Stripe is not configured on the server. Please provide STRIPE_SECRET_KEY.');
      (error as unknown as { statusCode: number }).statusCode = 503;
      throw error;
    }

    stripeClient = new Stripe(config.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
      appInfo: {
        name: 'Digital Heroes Golf Platform',
        version: '1.0.0'
      }
    });
  }

  return stripeClient;
};

/**
 * Plan to Stripe Price ID mappings.
 */
export const getStripePriceId = (planType: 'monthly' | 'yearly'): string | null => {
  if (planType === 'monthly') {
    return config.STRIPE_MONTHLY_PRICE_ID || null;
  }
  if (planType === 'yearly') {
    return config.STRIPE_YEARLY_PRICE_ID || null;
  }
  return null;
};
