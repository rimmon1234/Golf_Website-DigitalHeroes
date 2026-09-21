import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './index.js';

let adminClient: SupabaseClient | null = null;
let publicClient: SupabaseClient | null = null;

/**
 * Returns a privileged Supabase client with the service role secret key.
 * Strictly used for server-side trusted operations (e.g. user promotion, webhooks).
 */
export const getAdminSupabase = (): SupabaseClient => {
  if (!config.SUPABASE_URL || !config.SUPABASE_SECRET_KEY) {
    throw new Error('Supabase URL or Secret Key is not configured on the server.');
  }

  if (!adminClient) {
    adminClient = createClient(config.SUPABASE_URL, config.SUPABASE_SECRET_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  return adminClient;
};

/**
 * Returns a public Supabase client using the publishable anon key.
 */
export const getPublicSupabase = (): SupabaseClient => {
  if (!config.SUPABASE_URL || !config.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('Supabase URL or Publishable Key is not configured on the server.');
  }

  if (!publicClient) {
    publicClient = createClient(config.SUPABASE_URL, config.SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  return publicClient;
};

/**
 * Returns a user-scoped Supabase client carrying the user's Bearer JWT.
 * This ensures that database queries executed on behalf of the user strictly respect Row Level Security (RLS).
 */
export const getUserSupabase = (jwt: string): SupabaseClient => {
  if (!config.SUPABASE_URL || !config.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('Supabase URL or Publishable Key is not configured on the server.');
  }

  return createClient(config.SUPABASE_URL, config.SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }
  });
};
