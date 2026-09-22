import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/index.js';
import { healthRouter } from './routes/health.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { charityRouter } from './routes/charity.routes.js';
import { scoreRouter } from './routes/score.routes.js';
import { charityPreferenceRouter } from './routes/charityPreference.routes.js';
import { subscriptionRouter } from './routes/subscription.routes.js';
import { webhookRouter } from './routes/webhook.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createApp = (): Express => {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: [config.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Stripe-Signature']
    })
  );

  // Request logging in development
  if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // 1. Stripe Webhook route MUST receive raw body for signature verification BEFORE express.json()
  app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookRouter);

  // 2. Global JSON and URL-encoded body parsing for all other endpoints
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Mount application routes
  app.use('/api', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/charities', charityRouter);
  app.use('/api/scores', scoreRouter);
  app.use('/api/charity-preference', charityPreferenceRouter);
  app.use('/api/subscriptions', subscriptionRouter);

  // 404 handler for undefined routes
  app.use((_req, res) => {
    res.status(404).json({
      status: 'error',
      statusCode: 404,
      message: 'Resource not found'
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};
