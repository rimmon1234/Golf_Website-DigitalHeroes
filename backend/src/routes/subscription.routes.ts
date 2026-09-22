import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import {
  createCheckout,
  getMySubscription,
  cancelSubscription,
  reactivateSubscription,
  createPortal
} from '../controllers/subscription.controller.js';

export const subscriptionRouter = Router();

// All subscription management routes require authentication
subscriptionRouter.use(authenticateUser);

subscriptionRouter.post('/checkout', createCheckout);
subscriptionRouter.get('/me', getMySubscription);
subscriptionRouter.post('/cancel', cancelSubscription);
subscriptionRouter.post('/reactivate', reactivateSubscription);
subscriptionRouter.post('/portal', createPortal);
