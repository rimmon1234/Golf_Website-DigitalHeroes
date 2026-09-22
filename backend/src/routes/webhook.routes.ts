import { Router } from 'express';
import { handleStripeWebhook } from '../controllers/webhook.controller.js';

export const webhookRouter = Router();

// Public webhook route (signature verified against raw body)
webhookRouter.post('/', handleStripeWebhook);
