import { Request, Response, NextFunction } from 'express';
import { webhookService } from '../services/webhook.service.js';

/**
 * POST /api/payments/webhook
 * Public webhook endpoint for Stripe events.
 * Signature is strictly verified against the raw request body.
 */
export const handleStripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const signature = req.headers['stripe-signature'];

    if (!signature || typeof signature !== 'string') {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Missing Stripe-Signature header'
      });
      return;
    }

    const rawBody = req.body;
    if (!rawBody || (!Buffer.isBuffer(rawBody) && typeof rawBody !== 'string')) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid raw body format for Stripe signature verification'
      });
      return;
    }

    // 1. Construct & verify event with Stripe SDK
    const event = webhookService.constructEvent(rawBody, signature);

    // 2. Idempotently process event
    const result = await webhookService.processEvent(event);

    res.status(200).json({
      received: true,
      handled: result.handled,
      message: result.message
    });
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string };
    // If it is a signature error, return 400
    if (err.statusCode === 400 || (err.message && err.message.includes('signature'))) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: err.message || 'Signature verification failed'
      });
      return;
    }

    // Otherwise pass to global error handler for 500
    next(error);
  }
};
