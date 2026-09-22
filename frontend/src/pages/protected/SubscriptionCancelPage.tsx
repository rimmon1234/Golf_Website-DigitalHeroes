import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import { XCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const SubscriptionCancelPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Checkout Cancelled | Digital Heroes';
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-16 sm:py-24 flex items-center justify-center">
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl shadow-slate-950/50">
          <div className="w-16 h-16 rounded-3xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
            Checkout Cancelled
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed mb-8 max-w-sm mx-auto">
            You were not charged. Your checkout session was cancelled, and no active subscription was created.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/subscription"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 hover:brightness-110 transition shadow-lg shadow-brand-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Choose a Plan</span>
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-xs sm:text-sm font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750 transition"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubscriptionCancelPage;
