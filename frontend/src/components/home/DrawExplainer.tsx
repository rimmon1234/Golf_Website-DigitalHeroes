import React from 'react';
import { Trophy, CheckCircle, AlertCircle } from 'lucide-react';

export const DrawExplainer: React.FC = () => {
  const tiers = [
    {
      match: '5-Number Match',
      percentage: '40%',
      label: 'Jackpot Tier',
      description: 'Awarded to entries matching all 5 drawn numbers. Unclaimed jackpot pool rolls over to subsequent months.',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
    },
    {
      match: '4-Number Match',
      percentage: '35%',
      label: 'Major Tier',
      description: 'Awarded to entries matching any 4 of the 5 drawn numbers, divided proportionally among qualifiers.',
      badgeColor: 'bg-brand-500/10 text-brand-300 border-brand-500/30'
    },
    {
      match: '3-Number Match',
      percentage: '25%',
      label: 'Supporting Tier',
      description: 'Awarded to entries matching any 3 of the 5 drawn numbers, rewarding consistent participation.',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
    }
  ];

  return (
    <section className="py-20 bg-slate-950/70 border-t border-slate-900 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Monthly Reward Mechanics</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Transparent Monthly Prize Pool
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every active member with five recorded Stableford rounds participates in the monthly draw. Winning numbers are drawn transparently each month.
          </p>
        </div>

        {/* Tier Distribution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tier.badgeColor}`}>
                    {tier.label}
                  </span>
                  <span className="font-mono text-xs text-slate-500">Tier {idx + 1}</span>
                </div>

                <div className="space-y-1">
                  <div className="font-display font-black text-3xl text-white">{tier.percentage}</div>
                  <div className="font-display font-bold text-base text-slate-200">{tier.match}</div>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed">{tier.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/70 flex items-center gap-1.5 text-[11px] text-slate-500">
                <CheckCircle className="w-3.5 h-3.5 text-brand-400" />
                <span>Prize pool share</span>
              </div>
            </div>
          ))}
        </div>

        {/* Informational Callout / Guardrail Note */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 max-w-3xl mx-auto flex items-start gap-3.5 text-xs text-slate-400 leading-relaxed">
          <AlertCircle className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-200">How Pool Distribution Operates:</span>
            <p>
              Prize allocations are calculated directly as percentages of the monthly net prize pool. Entries require an active subscription and 5 current Stableford scores. No guaranteed returns are implied or promised. Draw verification is publicly recorded.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DrawExplainer;
