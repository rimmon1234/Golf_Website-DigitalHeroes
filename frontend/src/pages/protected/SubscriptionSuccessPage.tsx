import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import { getMySubscription } from '../../services/api.ts';
import { CheckCircle2, Loader2, ArrowRight, Trophy, Heart, RefreshCw } from 'lucide-react';

export const SubscriptionSuccessPage: React.FC = () => {

  const [status, setStatus] = useState<'verifying' | 'active' | 'pending' | 'error'>('verifying');
  const [pollCount, setPollCount] = useState<number>(0);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = 'Payment Successful | Digital Heroes';

    let count = 0;
    const maxPolls = 10; // 10 polls * 1.5s = 15s max timeout

    const checkSubscription = async () => {
      try {
        count++;
        setPollCount(count);

        const data = await getMySubscription();

        if (data.isActive) {
          setStatus('active');
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          return;
        }

        if (count >= maxPolls) {
          setStatus('pending');
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        }
      } catch (err) {
        console.error('Error polling subscription state:', err);
        if (count >= maxPolls) {
          setStatus('error');
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        }
      }
    };

    // Initial check
    checkSubscription();

    // Poll every 1.5 seconds
    pollIntervalRef.current = setInterval(checkSubscription, 1500);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-16 sm:py-24 flex items-center justify-center">
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl shadow-slate-950/50">
          {/* 1. Verifying state */}
          {status === 'verifying' && (
            <div>
              <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
                Payment Completed
              </h1>
              <p className="text-sm text-slate-300 mb-4">
                We're confirming your membership with Stripe...
              </p>
              <div className="w-full max-w-xs mx-auto bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-brand-400 h-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(pollCount * 10, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* 2. Active confirmed state */}
          {status === 'active' && (
            <div>
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
                Welcome to Digital Heroes!
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed mb-8 max-w-md mx-auto">
                Your membership is active. You can now track your Stableford scores, support your chosen charity, and participate in upcoming monthly prize draws.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Link
                  to="/scores"
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-brand-500/50 transition flex items-center gap-3 text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Track Scores</h4>
                    <p className="text-xs text-slate-400">Log your first round</p>
                  </div>
                </Link>

                <Link
                  to="/my-charity"
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-rose-500/50 transition flex items-center gap-3 text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Select Charity</h4>
                    <p className="text-xs text-slate-400">Direct your donation</p>
                  </div>
                </Link>
              </div>

              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 hover:brightness-110 transition shadow-lg shadow-brand-500/20"
              >
                <span>Go to Member Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* 3. Pending delayed state */}
          {status === 'pending' && (
            <div>
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
                Confirmation in Progress
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-md mx-auto">
                Your payment was received. Our system is still receiving the final webhook confirmation from Stripe. Your account will automatically activate in a few moments.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="py-2.5 px-6 rounded-xl text-xs font-bold bg-brand-400 text-slate-950 hover:bg-brand-300 transition cursor-pointer"
                >
                  Refresh Status
                </button>
                <Link
                  to="/dashboard"
                  className="py-2.5 px-6 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* 4. Error state */}
          {status === 'error' && (
            <div>
              <h1 className="text-xl font-bold text-white mb-2">Unable to Confirm Status</h1>
              <p className="text-xs text-slate-400 mb-6">
                If your card was charged, your subscription will be credited shortly. You can check your membership details anytime.
              </p>
              <Link
                to="/subscription"
                className="inline-block py-2.5 px-6 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 transition"
              >
                Return to Membership
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubscriptionSuccessPage;
