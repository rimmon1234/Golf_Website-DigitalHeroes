import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Activity, HeartHandshake, Award, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Join & Subscribe',
      description:
        'Select flexible monthly or discounted annual membership. Zero lock-in, immediate access to scoring and partner causes.'
    },
    {
      number: '02',
      icon: Activity,
      title: 'Play & Maintain 5 Scores',
      description:
        'Log your 18-hole Stableford scores. The system tracks your rolling five most recent scores to determine your draw entry numbers.'
    },
    {
      number: '03',
      icon: HeartHandshake,
      title: 'Direct Your Charity Impact',
      description:
        'Select any verified partner charity from our directory. A minimum of 10% of your membership goes directly to your selected cause.'
    },
    {
      number: '04',
      icon: Award,
      title: 'Enter the Monthly Draw',
      description:
        'Your rolling scores are entered automatically into the monthly draw. Match 3, 4, or 5 numbers to win from the transparent reward pool.'
    }
  ];

  return (
    <section className="py-20 bg-slate-950/60 border-y border-slate-900 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold uppercase tracking-wider">
            Clear Four-Step Loop
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            How The Platform Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            A seamless experience combining athletic performance, verified philanthropy, and exciting monthly rewards.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/40 transition-all duration-200 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/5"
              >
                <div className="space-y-4">
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-slate-700 group-hover:text-brand-400/80 transition-colors">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-brand-400 group-hover:border-brand-500/30 group-hover:bg-brand-500/10 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white group-hover:text-brand-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-500 font-medium">
                  Step {idx + 1} of 4
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Link */}
        <div className="mt-12 text-center">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-400 hover:text-brand-300 transition"
          >
            <span>Read Complete Mechanics & Draw Rules</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
