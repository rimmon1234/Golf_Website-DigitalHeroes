import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts';
import { UserProfile } from '../types/auth.ts';
import { setAuthToken, fetchCurrentUserProfile } from '../services/api.ts';

export interface SignUpResult {
  user: User | null;
  session: Session | null;
  needsEmailConfirmation: boolean;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (fullName: string, email: string, password: string) => Promise<SignUpResult>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to load profile from backend /api/auth/me using active token
  const loadProfile = useCallback(async (token: string, currentUser: User): Promise<UserProfile | null> => {
    setAuthToken(token);
    try {
      const p = await fetchCurrentUserProfile(token);
      setProfile(p);
      return p;
    } catch {
      // Fallback if backend database user row is being synced or queried
      const fallbackProfile: UserProfile = {
        id: currentUser.id,
        email: currentUser.email || null,
        full_name: (currentUser.user_metadata?.full_name as string) || null,
        avatar_url: (currentUser.user_metadata?.avatar_url as string) || null,
        role: 'user',
        created_at: currentUser.created_at
      };
      setProfile(fallbackProfile);
      return fallbackProfile;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          await loadProfile(initialSession.access_token, initialSession.user);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          setAuthToken(null);
        }
      } catch (err) {
        console.error('Error initializing auth session:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          await loadProfile(currentSession.access_token, currentSession.user);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          setAuthToken(null);
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setAuthToken(null);
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signUp = async (fullName: string, email: string, password: string): Promise<SignUpResult> => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
          // Never send role from frontend
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    const needsEmailConfirmation = Boolean(data.user && !data.session);

    if (data.session && data.user) {
      setSession(data.session);
      setUser(data.user);
      await loadProfile(data.session.access_token, data.user);
    }

    return {
      user: data.user,
      session: data.session,
      needsEmailConfirmation
    };
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.session && data.user) {
      setSession(data.session);
      setUser(data.user);
      await loadProfile(data.session.access_token, data.user);
    }
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    setAuthToken(null);
  };

  const refreshProfile = async (): Promise<void> => {
    if (session && user) {
      await loadProfile(session.access_token, user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
