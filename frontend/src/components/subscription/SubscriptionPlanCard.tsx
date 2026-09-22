import React from 'react';
import { PlanConfig } from '../../config/pricing.js';
import { Check, Sparkles, Loader2 } from 'lucide-react';

interface SubscriptionPlanCardProps {
  plan: PlanConfig;
  isLoading: boolean;
  onSubscribe: (planId: 'monthly' | 'yearly') => void;
}

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  isLoading,
  onSubscribe
}) => {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
        plan.popular
          ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-brand-500/60 shadow-xl shadow-brand-500/10'
          : 'bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80'
      }`}
    >
      {/* Popular / Best Value Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            {plan.badge}
          </span>
        </div>
      )}

      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold font-display text-white">{plan.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{plan.priceNote}</p>
          </div>
        </div>

        {/* Pricing Display */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl sm:text-5xl font-extrabold font-display text-white">
            ${plan.price}
          </span>
          <span className="text-sm font-medium text-slate-400">
            / {plan.id === 'monthly' ? 'month' : 'year'}
          </span>
        </div>

        {plan.savingsText && (
          <div className="mb-6">
            <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {plan.savingsText}
            </span>
          </div>
        )}

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          {plan.description}
        </p>

        {/* Feature List */}
        <div className="border-t border-slate-800/80 pt-6 mb-8">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Included in your membership:
          </h4>
          <ul className="space-y-3">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                <div className="mt-0.5 w-4 h-4 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        disabled={isLoading}
        onClick={() => onSubscribe(plan.id)}
        className={`w-full py-3.5 px-6 rounded-2xl text-sm font-bold tracking-wide transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
          plan.popular
            ? 'bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 hover:brightness-110 shadow-brand-500/20'
            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Connecting to Stripe...</span>
          </>
        ) : (
          <span>{plan.ctaText}</span>
        )}
      </button>
    </div>
  );
};

export default SubscriptionPlanCard;
