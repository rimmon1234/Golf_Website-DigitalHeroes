import React from 'react';
import { Link } from 'react-router-dom';
import { Charity } from '../../types/charity.js';
import { FeaturedCharity } from '../charities/FeaturedCharity.tsx';
import { Heart, ShieldCheck, ArrowRight, Users } from 'lucide-react';

interface CharityImpactSectionProps {
  featuredCharity: Charity | null;
}

export const CharityImpactSection: React.FC<CharityImpactSectionProps> = ({ featuredCharity }) => {
  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-brand-400" />
              <span>Philanthropy First</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Giving Back With Every Round
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Charity is not an afterthought. A minimum of 10% of every subscriber&apos;s membership is directly allocated to your chosen cause, funding youth sports, ecological conservation, and community wellness.
            </p>
          </div>

          <Link
            to="/charities"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition shrink-0"
          >
            <span>Explore All Charities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Charity Banner (From Live Database) */}
        {featuredCharity && (
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
              <span>Spotlight Organization</span>
            </div>
            <FeaturedCharity charity={featuredCharity} />
          </div>
        )}

        {/* Three Core Tenets of Charity Integration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-base">
              10%
            </div>
            <h3 className="font-display font-bold text-base text-white">Guaranteed Minimum Allocation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every monthly and annual subscription commits at least 10% of gross revenue straight toward your designated charitable partner.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">Subscriber-Directed Giving</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You choose the cause that matters to you: youth access, veteran rehabilitation, environmental preservation, or STEM education.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">Verified Nonprofit Partners</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We partner exclusively with verified organizations with active track records and clear grassroots community initiatives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CharityImpactSection;
