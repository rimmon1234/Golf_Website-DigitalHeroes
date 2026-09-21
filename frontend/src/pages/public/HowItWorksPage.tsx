import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import {
  UserPlus,
  Activity,
  HeartHandshake,
  Trophy,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  useEffect(() => {
    document.title = 'How It Works | Digital Heroes Platform';
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Join & Choose Your Plan',
      icon: UserPlus,
      subtitle: 'Flexible Monthly or Discounted Annual Membership',
      details: [
        'Select between standard monthly membership or the discounted annual supporter option.',
        'Immediate access to your personal golf scoring portal and charity dashboard.',
        'Subscriptions can be adjusted or canceled anytime without penalties.'
      ]
    },
    {
      num: '02',
      title: 'Track Your 5 Stableford Scores',
      icon: Activity,
      subtitle: 'Rolling Performance Engine',
      details: [
        'Enter your 18-hole Stableford scores after each competitive or casual round.',
        'The platform maintains your rolling five most recent scores to calculate an active index.',
        'These five scores serve as your verified basis for each monthly draw.'
      ]
    },
    {
      num: '03',
      title: 'Select Your Charitable Cause',
      icon: HeartHandshake,
      subtitle: 'Guaranteed Minimum 10% Contribution',
      details: [
        'Browse our verified charity directory spanning youth golf, veterans rehabilitation, and environmental conservation.',
        'A minimum of 10% of your membership fee is automatically directed to your selected cause.',
        'Switch your charity partner anytime before the monthly billing cycle closes.'
      ]
    },
    {
      num: '04',
      title: 'Monthly Draw & Prize Tiers',
      icon: Trophy,
      subtitle: 'Transparent Net Prize Pool Distribution',
      details: [
        'At the end of each monthly cycle, five winning numbers are drawn.',
        'Match 3 Numbers (25% Prize Pool Share) rewards steady participation.',
        'Match 4 Numbers (35% Prize Pool Share) for major pool rewards.',
        'Match 5 Numbers (40% Jackpot Tier) with automatic rollover if unwon.'
      ]
    }
  ];

  const faqs = [
    {
      q: 'What is Stableford scoring?',
      a: 'Stableford is an internationally recognized scoring system where golfers earn points based on the number of strokes taken on each hole relative to par. It encourages positive play and normalizes handicap differences across varied courses.'
    },
    {
      q: 'How does the charity allocation work?',
      a: 'Digital Heroes mandates that a minimum of 10% of gross subscription revenue is remitted directly to the registered charity you have selected. All featured nonprofits are vetted with transparent community programs.'
    },
    {
      q: 'What happens if I haven’t entered 5 scores yet?',
      a: 'To participate in the monthly draw, a member must have recorded 5 valid 18-hole Stableford scores. Once your fifth score is submitted, your account automatically qualifies for all upcoming monthly draws.'
    },
    {
      q: 'What happens if no one matches all 5 numbers?',
      a: 'If no qualifying participant matches all 5 numbers in a given month, the 40% Jackpot Tier allocation rolls over into the subsequent month’s jackpot, compounding the potential reward pool.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500/20 selection:text-brand-300">
      <Navbar />

      <main className="flex-1 w-full pb-20">
        {/* Header Hero */}
        <section className="relative overflow-hidden py-16 md:py-24 border-b border-slate-900 bg-slate-950">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform Mechanics Explained</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
              How Digital Heroes Works
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              A comprehensive breakdown of how your golf scores, charitable contributions, and monthly draw entries interact seamlessly.
            </p>
          </div>
        </section>

        {/* 4 Steps Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-12">
          <div className="space-y-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all duration-200 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
                  <div className="lg:col-span-4 flex items-center lg:items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500/20 to-emerald-400/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-brand-400 tracking-wider">
                        STEP {step.num}
                      </span>
                      <h3 className="font-display font-bold text-xl text-white mt-0.5">{step.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{step.subtitle}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-8 pl-0 lg:pl-6 lg:border-l lg:border-slate-800/80 space-y-3">
                    <ul className="space-y-2.5">
                      {step.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prize Distribution Overview */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Trophy className="w-4 h-4" />
                <span>Prize Pool Distribution Model</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white">How Draw Rewards are Shared</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
                The monthly net reward pool is allocated according to strict percentages defined in the product specification:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="font-mono text-2xl font-extrabold text-amber-400">40%</div>
                <div className="font-display font-semibold text-sm text-white">5-Number Match</div>
                <p className="text-[11px] text-slate-400">Jackpot Tier. Rollover to next draw if no ticket qualifies.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="font-mono text-2xl font-extrabold text-brand-400">35%</div>
                <div className="font-display font-semibold text-sm text-white">4-Number Match</div>
                <p className="text-[11px] text-slate-400">Major Tier. Shared equally across all 4-match entries.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="font-mono text-2xl font-extrabold text-emerald-400">25%</div>
                <div className="font-display font-semibold text-sm text-white">3-Number Match</div>
                <p className="text-[11px] text-slate-400">Supporting Tier. Rewards consistent round participation.</p>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-6 pt-6">
            <div className="text-center max-w-md mx-auto space-y-2">
              <h3 className="font-display font-bold text-2xl text-white">Frequently Asked Questions</h3>
              <p className="text-slate-400 text-xs">Everything you need to know about membership and scoring.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <h4 className="font-display font-semibold text-sm text-white">{faq.q}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-brand-400 to-emerald-400 hover:from-brand-300 hover:to-emerald-300 transition shadow-lg shadow-brand-500/20"
            >
              <span>Join Digital Heroes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/charities"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
            >
              <span>Explore Partner Charities</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
