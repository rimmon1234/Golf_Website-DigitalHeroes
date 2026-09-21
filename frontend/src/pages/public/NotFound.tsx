import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-6">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-900/80 p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center mx-auto">
          <HelpCircle className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">404 Error</span>
          <h1 className="text-2xl font-display font-bold text-white mt-1">Page Not Found</h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            The requested page does not exist or has been moved.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-400 text-slate-950 transition shadow-lg shadow-brand-500/20"
        >
          <Home className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
