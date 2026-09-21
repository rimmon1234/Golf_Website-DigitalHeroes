import { Router, Request, Response, NextFunction } from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { getAdminSupabase, getUserSupabase } from '../config/supabase.js';

export const authRouter = Router();

/**
 * GET /api/auth/me
 * Retrieves the profile of the currently authenticated user.
 */
authRouter.get(
  '/me',
  authenticateUser,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          status: 'error',
          statusCode: 401,
          message: 'Unauthorized'
        });
        return;
      }

      // Query public.users
      let client;
      try {
        client = getAdminSupabase();
      } catch {
        client = getUserSupabase(req.authToken!);
      }

      const { data: profile, error } = await client
        .from('users')
        .select('id, full_name, email, avatar_url, role, created_at, updated_at')
        .eq('id', req.user.id)
        .single();

      if (error || !profile) {
        res.status(404).json({
          status: 'error',
          statusCode: 404,
          message: 'User profile not found in database'
        });
        return;
      }

      res.status(200).json({
        status: 'ok',
        data: {
          user: profile
        }
      });
    } catch (error) {
      next(error);
    }
  }
);
