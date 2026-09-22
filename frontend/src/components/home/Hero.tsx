import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Trophy, Sparkles, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/15 to-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>GOLF PERFORMANCE · CHARITY IMPACT · MONTHLY DRAWS</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
              Play Your Game. <br />
              <span className="bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Fuel Great Causes.
              </span> <br />
              Win Real Rewards.
            </h1>

            {/* Subheading / Value Proposition */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              The modern platform uniting golf performance tracking with transparent philanthropy. Maintain your 5 scores, direct at least 10% of your membership to verified charities, and enter the monthly prize draw.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-brand-400 to-emerald-400 hover:from-brand-300 hover:to-emerald-300 transition shadow-xl shadow-brand-500/20 active:scale-[0.98]"
              >
                <span>Become a Member</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/charities"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition"
              >
                <Heart className="w-4 h-4 text-brand-400" />
                <span>Explore Charities</span>
              </Link>
            </div>

            {/* Value Indicators */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-left">
              <div>
                <div className="text-lg sm:text-xl font-display font-extrabold text-white">Min 10%</div>
                <div className="text-xs text-slate-400">Direct to Your Charity</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-display font-extrabold text-brand-300">5 Scores</div>
                <div className="text-xs text-slate-400">Rolling Handicap Basis</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-display font-extrabold text-emerald-400">Monthly</div>
                <div className="text-xs text-slate-400">Prize Pool Draw</div>
              </div>
            </div>
          </div>

          {/* Visual Interactive Composition Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Main Card: Interactive Golf + Charity Flow Card */}
              <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-6">
                {/* Header of Card */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center font-bold text-slate-950 text-base shadow-md shadow-brand-500/20">
                      5
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Active Handshake</div>
                      <div className="font-display font-bold text-sm text-white">Stableford Entry Card</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Draw Active
                  </span>
                </div>

                {/* Score Pills Visualization */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Rolling Five Scores</span>
                    <span className="font-mono text-brand-300">Handicap Basis</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {['38', '36', '41', '39', '42'].map((score, i) => (
                      <div
                        key={i}
                        className="py-2.5 rounded-xl bg-slate-950 border border-slate-800/90 text-sm font-display font-bold text-white shadow-inner"
                      >
                        {score}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 text-center pt-1">
                    Scores convert to your unique monthly draw entry
                  </p>
                </div>

                {/* Charity Allocation Callout */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-950/40 via-slate-950 to-slate-950 border border-brand-500/20 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400 shrink-0">
                    <Heart className="w-4 h-4 fill-brand-400" />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-white">Youth & Community Causes</div>
                    <div className="text-slate-400 text-[11px]">10% of membership allocated every month</div>
                  </div>
                </div>

                {/* Draw Pool Cardlet */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-semibold text-white">Monthly Prize Draw</div>
                      <div className="text-[11px] text-slate-400">5-Match 40% · 4-Match 35% · 3-Match 25%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
