import { Request, Response, NextFunction } from 'express';
import { subscriptionService } from '../services/subscription.service.js';
import { stripeService } from '../services/stripe.service.js';
import { checkoutRequestSchema } from '../types/subscription.types.js';
import { config } from '../config/index.js';

/**
 * POST /api/subscriptions/checkout
 * Initiates a Stripe Checkout Session for monthly or yearly membership.
 */
export const createCheckout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const email = req.user!.email || '';

    // Validate body
    const parseResult = checkoutRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors.map((e) => e.message).join(', ');
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: errorMessage
      });
      return;
    }

    // 1. One active membership rule: Prevent duplicate active subscriptions
    const isActive = await subscriptionService.isUserSubscriptionActive(userId);
    if (isActive) {
      res.status(409).json({
        status: 'error',
        statusCode: 409,
        code: 'SUBSCRIPTION_ALREADY_ACTIVE',
        message: 'Your membership is already active. Please manage your existing subscription.'
      });
      return;
    }

    const { planType } = parseResult.data;

    const session = await stripeService.createCheckoutSession({
      userId,
      email,
      planType
    });

    res.status(200).json({
      status: 'ok',
      message: 'Checkout session created',
      data: {
        checkoutUrl: session.checkoutUrl,
        sessionId: session.sessionId
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/subscriptions/me
 * Retrieves current user's subscription status, active state, and payment history.
 */
export const getMySubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const [subscription, isActive, payments] = await Promise.all([
      subscriptionService.getSubscriptionForUser(userId),
      subscriptionService.isUserSubscriptionActive(userId),
      subscriptionService.getPaymentHistory(userId)
    ]);

    res.status(200).json({
      status: 'ok',
      data: {
        subscription,
        isActive,
        payments
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/subscriptions/cancel
 * Schedules subscription cancellation at the end of the current billing cycle.
 */
export const cancelSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const updatedSubscription = await subscriptionService.cancelSubscription(userId);

    res.status(200).json({
      status: 'ok',
      message: 'Membership will be cancelled at the end of the current billing period.',
      data: {
        subscription: updatedSubscription
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/subscriptions/reactivate
 * Reactivates a subscription pending cancellation.
 */
export const reactivateSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const updatedSubscription = await subscriptionService.reactivateSubscription(userId);

    res.status(200).json({
      status: 'ok',
      message: 'Membership reactivated successfully.',
      data: {
        subscription: updatedSubscription
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/subscriptions/portal
 * Generates a Stripe Billing Portal session for the user.
 */
export const createPortal = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const subscription = await subscriptionService.getSubscriptionForUser(userId);

    if (!subscription || !subscription.stripe_customer_id) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'No billing account found for this member.'
      });
      return;
    }

    const returnUrl = `${config.CLIENT_URL}/subscription`;
    const portal = await stripeService.createPortalSession(subscription.stripe_customer_id, returnUrl);

    res.status(200).json({
      status: 'ok',
      data: {
        portalUrl: portal.url
      }
    });
  } catch (error) {
    next(error);
  }
};
