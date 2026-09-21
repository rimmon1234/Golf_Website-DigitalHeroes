import { Request, Response, NextFunction } from 'express';
import { getPublicSupabase, getAdminSupabase, getUserSupabase } from '../config/supabase.js';

/**
 * Middleware: Verifies Bearer JWT via Supabase Auth server.
 * Attaches verified user context to Express request.
 */
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: 'error',
        statusCode: 401,
        message: 'Unauthorized: Missing or invalid Authorization header'
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({
        status: 'error',
        statusCode: 401,
        message: 'Unauthorized: Bearer token is missing'
      });
      return;
    }

    let supabase;
    try {
      supabase = getPublicSupabase();
    } catch (configError) {
      res.status(503).json({
        status: 'error',
        statusCode: 503,
        message: 'Authentication service unavailable: Supabase is not configured on the server'
      });
      return;
    }

    // Securely verify JWT with Supabase Auth server
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData.user) {
      res.status(401).json({
        status: 'error',
        statusCode: 401,
        message: 'Unauthorized: Invalid or expired authentication token'
      });
      return;
    }

    // Attach authenticated user details
    req.user = {
      id: authData.user.id,
      email: authData.user.email
    };
    req.authToken = token;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware: Requires the authenticated user to possess the 'admin' role.
 * Queries public.users using server privilege or user-scoped client.
 */
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // First ensure user is authenticated
  if (!req.user || !req.user.id) {
    res.status(401).json({
      status: 'error',
      statusCode: 401,
      message: 'Unauthorized: Authentication required'
    });
    return;
  }

  try {
    // Attempt query using admin client if available, else user-scoped client
    let client;
    try {
      client = getAdminSupabase();
    } catch {
      if (req.authToken) {
        client = getUserSupabase(req.authToken);
      } else {
        throw new Error('Supabase client unavailable');
      }
    }

    const { data: userProfile, error } = await client
      .from('users')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !userProfile) {
      res.status(403).json({
        status: 'error',
        statusCode: 403,
        message: 'Forbidden: Unable to verify user permissions'
      });
      return;
    }

    if (userProfile.role !== 'admin') {
      res.status(403).json({
        status: 'error',
        statusCode: 403,
        message: 'Forbidden: Administrator privileges required'
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
