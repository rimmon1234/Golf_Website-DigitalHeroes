import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';

export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const responsePayload: Record<string, unknown> = {
    status: 'error',
    statusCode,
    message
  };

  if (err.details) {
    responsePayload.details = err.details;
  }

  // Never expose stack trace in production
  if (config.NODE_ENV !== 'production') {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};
