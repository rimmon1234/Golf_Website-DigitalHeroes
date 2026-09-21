import { Router, Request, Response } from 'express';
import { config } from '../config/index.js';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: config.NODE_ENV
  });
});
