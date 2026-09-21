import React from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { Link, useNavigate } from 'react-router-dom';
import { User, Shield, LogOut, CheckCircle2, Home } from 'lucide-react';

export const DashboardPlaceholder: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500/20 selection:text-brand-300">
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center font-bold text-slate-950 font-display text-lg shadow-lg shadow-brand-500/20">
              D
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-white">Digital</span>
              <span className="font-display font-light text-lg tracking-tight text-brand-400 ml-1">Heroes</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <span className="w-2 h-2 rounded-full bg-brand-400"></span>
              Authenticated Session
            </span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-white">Protected User Dashboard</h1>
                <p className="text-xs text-slate-400">Phase 1 Authentication & Authorization Placeholder</p>
              </div>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              <Home className="w-4 h-4" /> Home
            </Link>
          </div>

          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center gap-3 text-brand-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />
              <span>
                Protected Route Accessible: You have securely authenticated via Supabase Auth and Bearer token verification.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Full Name</span>
                <span className="font-medium text-base text-white">{profile?.full_name || 'Not provided'}</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
                <span className="font-medium text-base text-white">{user?.email || profile?.email || 'N/A'}</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Assigned Role</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 uppercase">
                  {profile?.role || 'user'}
                </span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">User ID</span>
                <span className="font-mono text-xs text-slate-300 truncate block">{user?.id}</span>
              </div>
            </div>

            {profile?.role === 'admin' && (
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-purple-300 text-xs">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>You have administrator permissions enabled on your account.</span>
                </div>
                <Link
                  to="/admin"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition"
                >
                  Go to Admin Area
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        Digital Heroes Platform &copy; 2026 · Phase 1 Authenticated Session
      </footer>
    </div>
  );
};

export default DashboardPlaceholder;
