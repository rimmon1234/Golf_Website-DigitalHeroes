import React, { useEffect, useState, useCallback } from 'react';
import { checkBackendHealth, HealthResponse } from '../../services/api.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { Link } from 'react-router-dom';
import { Activity, CheckCircle2, XCircle, RefreshCw, Server, Globe, Shield, Lock, User, LogIn, UserPlus } from 'lucide-react';

export const Home: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(true);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const { user, profile, isConfigured } = useAuth();

  const fetchHealth = useCallback(async () => {
    setLoadingHealth(true);
    setHealthError(null);
    try {
      const data = await checkBackendHealth();
      setHealthData(data);
      setLastChecked(new Date());
    } catch (err) {
      setHealthError(err instanceof Error ? err.message : 'Failed to connect to backend');
      setHealthData(null);
      setLastChecked(new Date());
    } finally {
      setLoadingHealth(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500/20 selection:text-brand-300">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center font-bold text-slate-950 font-display text-lg shadow-lg shadow-brand-500/20">
              D
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-white">Digital</span>
              <span className="font-display font-light text-lg tracking-tight text-brand-400 ml-1">Heroes</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-400 text-slate-950 transition shadow-md shadow-brand-500/10"
                >
                  <User className="w-3.5 h-3.5" /> Dashboard ({profile?.role || 'user'})
                </Link>
                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition"
                  >
                    <Shield className="w-3.5 h-3.5" /> Admin
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  <LogIn className="w-3.5 h-3.5" /> Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-400 text-slate-950 transition shadow-md shadow-brand-500/10"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full space-y-10">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-brand-400 font-semibold mb-3">
            Phase 1 · Database + Auth + Authorization + RLS
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight mb-4">
            Golf Performance, Charity Impact & Monthly Prize Draws
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Phase 1 adds PostgreSQL schema migrations, fine-grained Row Level Security (RLS), Supabase Auth session synchronization, Bearer JWT validation, and role-based route protection.
          </p>
        </div>

        {/* Phase 1 Auth Verification Quick-Actions */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-white">Phase 1 Route Guard Testing</h2>
                <p className="text-xs text-slate-400">
                  Verify access control across public, authenticated, and administrative boundaries
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                isConfigured 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
                {isConfigured ? 'Supabase Configured' : 'Supabase Keys Pending'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/dashboard"
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-brand-500/50 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">Protected Route</span>
                <User className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition" />
              </div>
              <p className="text-sm font-medium text-white mb-1">/dashboard</p>
              <p className="text-xs text-slate-400">
                Requires authenticated session. Redirects unauthenticated visitors to login.
              </p>
            </Link>

            <Link
              to="/admin"
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Admin Route</span>
                <Shield className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition" />
              </div>
              <p className="text-sm font-medium text-white mb-1">/admin</p>
              <p className="text-xs text-slate-400">
                Requires authenticated user with role = 'admin'. Redirects others to 403 Forbidden.
              </p>
            </Link>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Active Auth State</span>
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-white mb-1 truncate">
                {user ? user.email : 'Anonymous Visitor'}
              </p>
              <p className="text-xs text-slate-400">
                Role: <span className="text-brand-300 font-semibold uppercase">{profile?.role || 'None'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Phase 0 System Health Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800 text-brand-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-white">Backend Health Endpoint</h2>
                <p className="text-xs text-slate-400">
                  Target: <code className="text-brand-300 font-mono bg-slate-800/80 px-2 py-0.5 rounded">GET /api/health</code> (Proxied to Express :5000)
                </p>
              </div>
            </div>

            <button
              onClick={fetchHealth}
              disabled={loadingHealth}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? 'animate-spin text-brand-400' : ''}`} />
              Re-check Status
            </button>
          </div>

          {loadingHealth && !healthData && (
            <div className="py-6 flex flex-col items-center justify-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin text-brand-400 mb-2" />
              <p className="text-xs">Checking backend connectivity...</p>
            </div>
          )}

          {healthError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-semibold text-rose-300">Backend Connection Failed</h3>
                <p className="text-xs text-rose-200/70 mt-1 font-mono">{healthError}</p>
              </div>
            </div>
          )}

          {healthData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Status</span>
                <span className="font-mono text-sm font-semibold text-brand-400 uppercase">{healthData.status}</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Environment</span>
                <span className="font-mono text-sm font-semibold text-slate-200 capitalize">{healthData.environment}</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Uptime</span>
                <span className="font-mono text-sm font-semibold text-slate-200">{healthData.uptime}s</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Timestamp</span>
                <span className="font-mono text-xs font-semibold text-slate-300 truncate block">
                  {new Date(healthData.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}

          {lastChecked && (
            <div className="mt-4 text-right text-xs text-slate-500">
              Last ping: {lastChecked.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Architectural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-sm text-white mb-1">Client Auth Session</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              React Context synchronizes Supabase session state, automatically appending Bearer JWTs to backend requests.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-sm text-white mb-1">Backend JWT Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Express middleware authenticates Bearer tokens via Supabase Auth and validates database-level roles.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-sm text-white mb-1">Row Level Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              PostgreSQL RLS policies enforce that users can only access their own scores, preferences, and winnings.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Digital Heroes Platform &copy; 2026</span>
          <span className="text-slate-400">Phase 1: Database, Authentication & RLS Complete</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
