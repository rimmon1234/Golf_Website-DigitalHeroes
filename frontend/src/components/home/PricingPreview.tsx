import React from 'react';
import { Link } from 'react-router-dom';
import { SUBSCRIPTION_PLANS } from '../../config/pricing.js';
import { Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const PricingPreview: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-slate-950 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold uppercase tracking-wider">
            Membership Options
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Simple, Transparent Membership
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Choose how you wish to support charity and participate in monthly prize draws. All tiers include full score logging, verified charity allocation, and draw eligibility.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 ${
                plan.popular
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-brand-500/50 shadow-2xl shadow-brand-500/10'
                  : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-brand-400 to-emerald-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-md shadow-brand-500/20">
                  <Zap className="w-3 h-3 fill-slate-950" />
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                </div>

                {/* Pricing Placeholder Note */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-1">
                  <div className="font-display font-black text-2xl text-white tracking-tight">
                    {plan.priceNote}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                    <span>{plan.billingFrequency} · Commercial checkout activates via Stripe</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Included Benefits:</span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <div className="w-4 h-4 rounded-full bg-brand-500/15 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-6 border-t border-slate-800/80">
                <Link
                  to="/signup"
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition ${
                    plan.popular
                      ? 'bg-gradient-to-r from-brand-400 to-emerald-400 hover:from-brand-300 hover:to-emerald-300 text-slate-950 shadow-lg shadow-brand-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="text-center text-xs text-slate-500 max-w-xl mx-auto">
          Final membership pricing and automated Stripe subscription billing will be enabled in Phase 4. Membership requires maintaining 5 valid Stableford scores to enter the monthly prize draw.
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;
