import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-6">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-900/80 p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-rose-400 font-semibold">403 Forbidden</span>
          <h1 className="text-2xl font-display font-bold text-white mt-1">Access Restricted</h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            You do not have administrator permissions to view this section. The route guard verified that your account does not have <code className="text-rose-300">role = 'admin'</code>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-400 text-slate-950 transition shadow-lg shadow-brand-500/20"
          >
            <Home className="w-4 h-4" /> Home Overview
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
