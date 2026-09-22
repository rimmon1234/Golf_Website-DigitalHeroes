import { getAdminSupabase } from '../config/supabase.js';
import { stripeService } from './stripe.service.js';
import { isStripeConfigured } from '../config/stripe.js';
import { Subscription, PaymentRecord } from '../types/subscription.types.js';

export class SubscriptionService {
  /**
   * Retrieves the current subscription for a given user.
   */
  async getSubscriptionForUser(userId: string): Promise<Subscription | null> {
    const supabase = getAdminSupabase();

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching subscription for user:', error.message);
      throw error;
    }

    return (data as Subscription) || null;
  }

  /**
   * Centralized check: is the user's subscription currently active?
   * Rule:
   * - status === 'active'
   * - current_period_end is null or in the future
   * (If cancel_at_period_end is true, access remains active until current_period_end).
   */
  async isUserSubscriptionActive(userId: string): Promise<boolean> {
    const subscription = await this.getSubscriptionForUser(userId);

    if (!subscription) {
      return false;
    }

    if (subscription.status !== 'active') {
      return false;
    }

    if (subscription.current_period_end) {
      const now = new Date();
      const periodEnd = new Date(subscription.current_period_end);
      if (now > periodEnd) {
        return false;
      }
    }

    return true;
  }

  /**
   * Schedules subscription cancellation at the end of the current billing cycle.
   */
  async cancelSubscription(userId: string): Promise<Subscription> {
    const subscription = await this.getSubscriptionForUser(userId);

    if (!subscription || subscription.status !== 'active') {
      const error = new Error('No active subscription found to cancel.');
      (error as unknown as { statusCode: number }).statusCode = 404;
      throw error;
    }

    if (subscription.cancel_at_period_end) {
      return subscription;
    }

    // If Stripe is configured and we have a Stripe subscription ID, update in Stripe
    if (subscription.stripe_subscription_id && isStripeConfigured()) {
      try {
        await stripeService.cancelSubscriptionAtPeriodEnd(subscription.stripe_subscription_id);
      } catch (err: unknown) {
        console.error('Failed to schedule cancellation in Stripe:', (err as Error).message);
      }
    }

    // Synchronize local record
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        cancelled_at: new Date().toISOString()
      })
      .eq('id', subscription.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Subscription;
  }

  /**
   * Reactivates a subscription that was scheduled to cancel at period end.
   */
  async reactivateSubscription(userId: string): Promise<Subscription> {
    const subscription = await this.getSubscriptionForUser(userId);

    if (!subscription || subscription.status !== 'active' || !subscription.cancel_at_period_end) {
      const error = new Error('No subscription pending cancellation was found to reactivate.');
      (error as unknown as { statusCode: number }).statusCode = 400;
      throw error;
    }

    // Check if period has already expired
    if (subscription.current_period_end && new Date() > new Date(subscription.current_period_end)) {
      const error = new Error('Current billing period has expired. Please subscribe to a new plan.');
      (error as unknown as { statusCode: number }).statusCode = 400;
      throw error;
    }

    if (subscription.stripe_subscription_id && isStripeConfigured()) {
      try {
        await stripeService.reactivateSubscription(subscription.stripe_subscription_id);
      } catch (err: unknown) {
        console.error('Failed to reactivate subscription in Stripe:', (err as Error).message);
      }
    }

    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: false,
        cancelled_at: null
      })
      .eq('id', subscription.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Subscription;
  }

  /**
   * Retrieves payment records for a user.
   */
  async getPaymentHistory(userId: string): Promise<PaymentRecord[]> {
    const supabase = getAdminSupabase();

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error.message);
      return [];
    }

    return (data as PaymentRecord[]) || [];
  }
}

export const subscriptionService = new SubscriptionService();
