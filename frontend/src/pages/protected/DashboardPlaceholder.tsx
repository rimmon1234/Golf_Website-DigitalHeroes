import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import { getScores, getCharityPreference } from '../../services/api.ts';
import { Score } from '../../types/score.js';
import { UserCharityPreference } from '../../types/charityPreference.js';
import {
  Trophy,
  Heart,
  TrendingUp,
  Layers,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  PlusCircle
} from 'lucide-react';

export const DashboardPlaceholder: React.FC = () => {
  const { profile } = useAuth();
  const [scores, setScores] = useState<Score[]>([]);
  const [preference, setPreference] = useState<UserCharityPreference | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = 'Member Dashboard | Digital Heroes';

    let isMounted = true;
    const fetchMemberOverview = async () => {
      try {
        const [scoresData, prefData] = await Promise.all([
          getScores(),
          getCharityPreference()
        ]);
        if (isMounted) {
          setScores(scoresData);
          setPreference(prefData);
        }
      } catch (err) {
        console.error('Failed to load dashboard overview data', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMemberOverview();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalPoints = scores.reduce((acc, curr) => acc + curr.score, 0);
  const recentAverage = scores.length > 0 ? (totalPoints / scores.length).toFixed(1) : '—';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500/20 selection:text-brand-300">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-brand-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Member Overview</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Welcome back, {profile?.full_name || 'Golfer'}!
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Track your golf scores, monitor your verified charity impact, and prepare for the monthly draw.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/scores"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-brand-400 to-emerald-400 hover:from-brand-300 hover:to-emerald-300 transition shadow-md shadow-brand-500/10 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Record Round</span>
            </Link>
          </div>
        </div>

        {/* Member Status Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Retained Scores Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Rolling Scores
              </div>
              <div className="font-display font-extrabold text-xl text-white">
                {loading ? '...' : `${scores.length} / 5`}
              </div>
            </div>
          </div>

          {/* Average Score Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Recent Average
              </div>
              <div className="font-display font-extrabold text-xl text-white">
                {loading ? '...' : `${recentAverage} pts`}
              </div>
            </div>
          </div>

          {/* Charity Allocation Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Charity Allocation
              </div>
              <div className="font-display font-extrabold text-xl text-white">
                {loading ? '...' : preference ? `${preference.contribution_percentage}%` : 'Not set'}
              </div>
            </div>
          </div>

          {/* Draw Eligibility Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Draw Basis
              </div>
              <div className="font-display font-bold text-sm text-white">
                {scores.length === 5 ? (
                  <span className="text-emerald-400 font-semibold">5 / 5 Qualified</span>
                ) : (
                  <span className="text-slate-400">{5 - scores.length} more needed</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Split Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Recent Scores Preview */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-brand-400" />
                <h3 className="font-display font-bold text-base text-white">Recent Scores</h3>
              </div>
              <Link
                to="/scores"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition"
              >
                <span>Manage Scores</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                <div className="h-12 bg-slate-950/60 rounded-xl animate-pulse" />
                <div className="h-12 bg-slate-950/60 rounded-xl animate-pulse" />
              </div>
            ) : scores.length > 0 ? (
              <div className="space-y-2.5">
                {scores.slice(0, 3).map((score, i) => (
                  <div
                    key={score.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-500">#{i + 1}</span>
                      <div className="flex items-center gap-1.5 text-white font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{score.score_date}</span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-brand-400 text-sm">
                      {score.score} pts
                    </span>
                  </div>
                ))}
                {scores.length > 3 && (
                  <p className="text-[11px] text-slate-500 text-center pt-1">
                    + {scores.length - 3} more retained rounds
                  </p>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                <p>No scores recorded yet.</p>
                <Link
                  to="/scores"
                  className="inline-flex items-center gap-1 text-brand-400 hover:underline font-semibold"
                >
                  Record your first round &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Right Panel: Selected Charity Preview */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <h3 className="font-display font-bold text-base text-white">Designated Charity</h3>
              </div>
              <Link
                to="/my-charity"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition"
              >
                <span>Change Cause</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="h-28 bg-slate-950/60 rounded-xl animate-pulse" />
            ) : preference && preference.charity ? (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-brand-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{preference.charity.category || 'Partner Cause'}</span>
                </div>
                <h4 className="font-display font-bold text-base text-white">
                  {preference.charity.name}
                </h4>
                <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Contribution Allocation:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {preference.contribution_percentage}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                <p>No charity selected yet.</p>
                <Link
                  to="/my-charity"
                  className="inline-flex items-center gap-1 text-brand-400 hover:underline font-semibold"
                >
                  Choose a charity &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPlaceholder;
