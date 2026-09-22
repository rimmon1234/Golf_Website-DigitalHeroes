import { Request, Response, NextFunction } from 'express';
import { subscriptionService } from '../services/subscription.service.js';

/**
 * Middleware: Enforces that the authenticated user possesses an active subscription.
 * Note: Must be placed after `authenticateUser` middleware.
 */
export const requireActiveSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        status: 'error',
        statusCode: 401,
        message: 'Unauthorized: Authentication required before checking subscription'
      });
      return;
    }

    const isActive = await subscriptionService.isUserSubscriptionActive(userId);

    if (!isActive) {
      res.status(403).json({
        status: 'error',
        statusCode: 403,
        code: 'SUBSCRIPTION_REQUIRED',
        message: 'An active subscription is required for this feature.'
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
