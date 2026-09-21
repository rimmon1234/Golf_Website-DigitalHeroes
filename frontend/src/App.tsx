import React, { useEffect, useState, useCallback } from 'react';
import { checkBackendHealth, HealthResponse } from './services/api.ts';
import { Activity, CheckCircle2, XCircle, RefreshCw, Server, Globe, Shield } from 'lucide-react';

export const App: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkBackendHealth();
      setHealthData(data);
      setLastChecked(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to backend');
      setHealthData(null);
      setLastChecked(new Date());
    } finally {
      setLoading(false);
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
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
              Phase 0 Foundation
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-brand-400 font-semibold mb-3">
            Platform Infrastructure Verification
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight mb-4">
            Golf Performance, Charity Impact & Monthly Prize Draws
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Phase 0 establishes the physical frontend & backend decoupling, typed configuration, and direct communication proxy.
          </p>
        </div>

        {/* System Health Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40 backdrop-blur-sm mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800 text-brand-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white">Backend Health Endpoint</h2>
                <p className="text-xs text-slate-400">
                  Target: <code className="text-brand-300 font-mono bg-slate-800/80 px-2 py-0.5 rounded">GET /api/health</code> (Proxied to Express :5000)
                </p>
              </div>
            </div>

            <button
              onClick={fetchHealth}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-400' : ''}`} />
              Re-check Status
            </button>
          </div>

          {/* Status Display */}
          {loading && !healthData && (
            <div className="py-8 flex flex-col items-center justify-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-brand-400 mb-3" />
              <p className="text-sm">Pinging backend on port 5000...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-rose-300">Backend Connection Failed</h3>
                <p className="text-xs text-rose-200/70 mt-1 font-mono">{error}</p>
                <p className="text-xs text-slate-400 mt-2">
                  Ensure the Express server is running on port 5000 (<code className="text-slate-300">npm run dev:backend</code>).
                </p>
              </div>
            </div>
          )}

          {healthData && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300">
                <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-semibold text-brand-200">Backend Connected Successfully:</span> Express API returned HTTP 200 via Vite dev proxy.
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Status</span>
                  <span className="font-mono text-base font-semibold text-brand-400 uppercase">{healthData.status}</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Environment</span>
                  <span className="font-mono text-base font-semibold text-slate-200 capitalize">{healthData.environment}</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Uptime</span>
                  <span className="font-mono text-base font-semibold text-slate-200">{healthData.uptime}s</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Server Timestamp</span>
                  <span className="font-mono text-xs font-semibold text-slate-300 truncate block">
                    {new Date(healthData.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {lastChecked && (
            <div className="mt-6 text-right text-xs text-slate-500">
              Last checked: {lastChecked.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Foundation Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-sm text-white mb-1">Independent Frontend</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              React + Vite + TypeScript with Tailwind CSS design tokens, React Router, and typed Axios client.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-sm text-white mb-1">Decoupled Backend</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Express server with Helmet security headers, CORS protection, Morgan logging, and Zod env validation.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-sm text-white mb-1">Strict Isolation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No leaked secrets. Publishable keys only on client; server-role keys strictly confined to backend.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Digital Heroes Platform &copy; 2026</span>
          <span className="text-slate-400">Phase 0: Project Foundation & Environment Verification</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
