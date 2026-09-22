import Stripe from 'stripe';
import { getStripe, isStripeConfigured } from '../config/stripe.js';
import { config } from '../config/index.js';
import { getAdminSupabase } from '../config/supabase.js';
import { SubscriptionStatus, PlanType } from '../types/subscription.types.js';

export class WebhookService {
  private static memoryProcessedEvents = new Set<string>();

  /**
   * Verifies the Stripe webhook signature and constructs the typed Stripe Event.
   */
  constructEvent(rawBody: Buffer | string, signature: string): Stripe.Event {
    if (!config.STRIPE_WEBHOOK_SECRET) {
      const err = new Error('STRIPE_WEBHOOK_SECRET is not configured on the server.');
      (err as unknown as { statusCode: number }).statusCode = 500;
      throw err;
    }

    const stripe = getStripe();
    try {
      return stripe.webhooks.constructEvent(
        rawBody,
        signature,
        config.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: unknown) {
      const verifyError = new Error(`Webhook signature verification failed: ${(err as Error).message}`);
      (verifyError as unknown as { statusCode: number }).statusCode = 400;
      throw verifyError;
    }
  }

  /**
   * Checks if an event ID has already been successfully processed (Idempotency).
   */
  async isEventProcessed(eventId: string): Promise<boolean> {
    if (WebhookService.memoryProcessedEvents.has(eventId)) {
      return true;
    }

    const supabase = getAdminSupabase();

    try {
      const { data } = await supabase
        .from('stripe_webhook_events')
        .select('id, status')
        .eq('stripe_event_id', eventId)
        .eq('status', 'processed')
        .maybeSingle();

      if (data) return true;
    } catch {
      // Table might not exist if migration was skipped; check payments fallback
    }

    // Fallback check: check if payments table already has this event/invoice ID
    const { data: payment } = await supabase
      .from('payments')
      .select('id')
      .eq('stripe_payment_id', eventId)
      .maybeSingle();

    return Boolean(payment);
  }

  /**
   * Records processed webhook event for idempotency and auditing.
   */
  async recordEvent(
    eventId: string,
    eventType: string,
    eventCreated: number,
    status: 'processed' | 'failed' | 'ignored' = 'processed',
    errorMessage?: string
  ): Promise<void> {
    if (status === 'processed') {
      WebhookService.memoryProcessedEvents.add(eventId);
    }

    const supabase = getAdminSupabase();

    try {
      await supabase.from('stripe_webhook_events').upsert(
        {
          stripe_event_id: eventId,
          event_type: eventType,
          event_created_at: new Date(eventCreated * 1000).toISOString(),
          processed_at: new Date().toISOString(),
          status,
          error_message: errorMessage || null
        },
        { onConflict: 'stripe_event_id' }
      );
    } catch {
      // Non-fatal if table doesn't exist
    }
  }


  /**
   * Maps Stripe subscription status to application status model.
   */
  mapStripeStatus(stripeStatus: Stripe.Subscription.Status): SubscriptionStatus {
    switch (stripeStatus) {
      case 'active':
      case 'trialing':
        return 'active';
      case 'past_due':
        return 'past_due';
      case 'unpaid':
        return 'unpaid';
      case 'canceled':
        return 'cancelled';
      case 'incomplete':
      case 'incomplete_expired':
      default:
        return 'incomplete';
    }
  }

  /**
   * Processes a verified Stripe webhook event.
   */
  async processEvent(event: Stripe.Event): Promise<{ handled: boolean; message: string }> {
    const supabase = getAdminSupabase();

    // Check idempotency
    const alreadyProcessed = await this.isEventProcessed(event.id);
    if (alreadyProcessed) {
      return { handled: true, message: 'Event already processed' };
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          await this.handleCheckoutSessionCompleted(session);
          break;
        }

        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          await this.handleSubscriptionUpdated(subscription, event.created);
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          await this.handleSubscriptionDeleted(subscription);
          break;
        }

        case 'invoice.paid': {
          const invoice = event.data.object as Stripe.Invoice;
          await this.handleInvoicePaid(invoice);
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          await this.handleInvoicePaymentFailed(invoice);
          break;
        }

        default:
          // Unhandled valid events are acknowledged safely
          await this.recordEvent(event.id, event.type, event.created, 'ignored');
          return { handled: true, message: `Event type ${event.type} ignored` };
      }

      // Record successful processing
      await this.recordEvent(event.id, event.type, event.created, 'processed');
      return { handled: true, message: `Event ${event.type} processed successfully` };
    } catch (err) {
      console.error(`Error processing webhook event ${event.type} (${event.id}):`, err);
      await this.recordEvent(event.id, event.type, event.created, 'failed', (err as Error).message);
      throw err;
    }
  }

  /**
   * Handles checkout.session.completed event.
   */
  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const supabase = getAdminSupabase();
    const userId = session.client_reference_id || session.metadata?.user_id;

    if (!userId) {
      console.warn('Checkout session completed without user_id:', session.id);
      return;
    }

    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
    const subscriptionId =
      typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
    const planType: PlanType = (session.metadata?.plan_type as PlanType) || 'monthly';

    // If subscription mode, upsert subscription
    if (subscriptionId) {
      const { data: existing } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      const payload = {
        user_id: userId,
        plan_type: planType,
        status: 'active' as SubscriptionStatus,
        stripe_customer_id: customerId || null,
        stripe_subscription_id: subscriptionId,
        updated_at: new Date().toISOString()
      };

      if (existing) {
        await supabase.from('subscriptions').update(payload).eq('id', existing.id);
      } else {
        await supabase.from('subscriptions').insert(payload);
      }
    }
  }

  /**
   * Handles customer.subscription.created and customer.subscription.updated events.
   */
  private async handleSubscriptionUpdated(
    subscription: Stripe.Subscription,
    eventCreated: number
  ): Promise<void> {
    const supabase = getAdminSupabase();
    const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
    const userId = subscription.metadata?.user_id;

    // Find the user if not in metadata
    let targetUserId = userId;
    if (!targetUserId) {
      const { data: subRow } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .maybeSingle();

      if (subRow) {
        targetUserId = subRow.user_id;
      } else {
        const { data: customerRow } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();
        targetUserId = customerRow?.user_id;
      }
    }

    if (!targetUserId) {
      console.warn('Could not identify user for subscription update:', subscription.id);
      return;
    }

    const rawSub = subscription as unknown as {
      current_period_start?: number;
      current_period_end?: number;
    };
    const internalStatus = this.mapStripeStatus(subscription.status);
    const planType: PlanType = (subscription.metadata?.plan_type as PlanType) || 'monthly';
    const periodStart = rawSub.current_period_start
      ? new Date(rawSub.current_period_start * 1000).toISOString()
      : null;
    const periodEnd = rawSub.current_period_end
      ? new Date(rawSub.current_period_end * 1000).toISOString()
      : null;

    // Event ordering check: check if user already has an active record
    const { data: currentRecord } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', targetUserId)
      .maybeSingle();

    const payload: Record<string, unknown> = {
      user_id: targetUserId,
      plan_type: planType,
      status: internalStatus,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancelled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString()
    };

    if (currentRecord) {
      const { error } = await supabase.from('subscriptions').update(payload).eq('id', currentRecord.id);
      if (error) {
        console.error('Failed to update subscription:', error.message);
        throw error;
      }
    } else {
      const { error } = await supabase.from('subscriptions').insert(payload);
      if (error) {
        console.error('Failed to insert subscription:', error.message);
        throw error;
      }
    }
  }

  /**
   * Handles customer.subscription.deleted event.
   */
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const supabase = getAdminSupabase();

    await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancel_at_period_end: false,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);
  }

  /**
   * Handles invoice.paid event: persists payment and snapshots charity allocation.
   */
  private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    const supabase = getAdminSupabase();
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
    const invoiceSub = (invoice as unknown as { subscription?: string | { id?: string } }).subscription;
    const subscriptionId = typeof invoiceSub === 'string' ? invoiceSub : invoiceSub?.id;

    // Find the associated user and internal subscription
    let targetUserId: string | null = null;
    let internalSubId: string | null = null;

    if (subscriptionId) {
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('id, user_id')
        .eq('stripe_subscription_id', subscriptionId)
        .maybeSingle();

      if (subData) {
        targetUserId = subData.user_id;
        internalSubId = subData.id;
      }
    }

    if (!targetUserId && customerId) {
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('id, user_id')
        .eq('stripe_customer_id', customerId)
        .maybeSingle();

      if (subData) {
        targetUserId = subData.user_id;
        internalSubId = subData.id;
      }
    }

    if (!targetUserId) {
      targetUserId = (invoice.metadata?.user_id as string) || null;
    }

    if (!targetUserId) {
      console.warn('Could not identify user for invoice.paid:', invoice.id);
      return;
    }


    const amount = (invoice.amount_paid || 0) / 100;
    const currency = (invoice.currency || 'USD').toUpperCase();
    const invoiceId = invoice.id;

    // 1. Persist payment record
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: targetUserId,
        subscription_id: internalSubId,
        stripe_payment_id: invoiceId,
        amount,
        currency,
        payment_type: 'subscription',
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Failed to persist payment for invoice:', paymentError.message);
      throw paymentError;
    }

    // 2. Snapshot Charity Allocation
    // Retrieve user's configured charity preference
    const { data: preference } = await supabase
      .from('user_charity_preferences')
      .select('charity_id, contribution_percentage')
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (preference && preference.charity_id && preference.contribution_percentage) {
      const percentage = Number(preference.contribution_percentage);
      const allocatedAmount = Number(((amount * percentage) / 100).toFixed(2));

      try {
        await supabase.from('subscription_charity_allocations').insert({
          payment_id: paymentRecord.id,
          subscription_id: internalSubId,
          user_id: targetUserId,
          charity_id: preference.charity_id,
          contribution_percentage: percentage,
          allocated_amount: allocatedAmount,
          currency,
          created_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Could not snapshot charity allocation table:', (err as Error).message);
      }
    }
  }

  /**
   * Handles invoice.payment_failed event.
   */
  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const supabase = getAdminSupabase();
    const invoiceSub = (invoice as unknown as { subscription?: string | { id?: string } }).subscription;
    const subscriptionId = typeof invoiceSub === 'string' ? invoiceSub : invoiceSub?.id;

    let targetUserId: string | null = null;
    let internalSubId: string | null = null;

    if (subscriptionId) {
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('id, user_id')
        .eq('stripe_subscription_id', subscriptionId)
        .maybeSingle();

      if (subData) {
        targetUserId = subData.user_id;
        internalSubId = subData.id;
      }
    }

    if (!targetUserId) return;

    const amount = (invoice.amount_due || 0) / 100;
    const currency = (invoice.currency || 'USD').toUpperCase();

    // Persist failed payment
    await supabase.from('payments').insert({
      user_id: targetUserId,
      subscription_id: internalSubId,
      stripe_payment_id: invoice.id,
      amount,
      currency,
      payment_type: 'subscription',
      status: 'failed',
      paid_at: null
    });

    // Update subscription to past_due
    if (internalSubId) {
      await supabase
        .from('subscriptions')
        .update({
          status: 'past_due',
          updated_at: new Date().toISOString()
        })
        .eq('id', internalSubId);
    }
  }
}

export const webhookService = new WebhookService();
