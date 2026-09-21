import React from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const AdminPlaceholder: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-purple-500/20 selection:text-purple-300">
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white font-display text-lg shadow-lg shadow-purple-500/20">
              A
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-white">Digital Heroes</span>
              <span className="font-display font-light text-xs tracking-wider uppercase text-purple-400 ml-2 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                Admin Area
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> User View
            </Link>
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
          <div className="flex items-center gap-3 border-b border-slate-800 pb-6 mb-6">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-white">Administrator Access Verified</h1>
              <p className="text-xs text-slate-400">Phase 1 Role-Based Route Guard Verified (role = 'admin')</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3 text-purple-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <span>
                Role Validation Passed: Your session verified the <code>role = 'admin'</code> claim via the database and backend authorization middleware.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Administrator</span>
                <span className="font-medium text-base text-white">{profile?.full_name || 'Admin User'}</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Admin Email</span>
                <span className="font-medium text-base text-white">{user?.email || profile?.email || 'N/A'}</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Authorization Status</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-purple-500/20 text-purple-300 uppercase">
                  role: admin
                </span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Admin ID</span>
                <span className="font-mono text-xs text-slate-300 truncate block">{user?.id}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        Digital Heroes Platform &copy; 2026 · Administrator Authorization Verified
      </footer>
    </div>
  );
};

export default AdminPlaceholder;
