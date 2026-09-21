import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Charity } from '../../types/charity.js';
import { Star, Heart, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

interface FeaturedCharityProps {
  charity: Charity;
}

export const FeaturedCharity: React.FC<FeaturedCharityProps> = ({ charity }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-brand-500/30 p-6 sm:p-8 md:p-10 shadow-2xl shadow-brand-500/5">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual / Media Column */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
            {charity.image_url && !imgError ? (
              <img
                src={charity.image_url}
                alt={charity.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-center">
                <Heart className="w-12 h-12 text-brand-400/50 mb-2" />
                <span className="font-display font-semibold text-sm text-slate-300">{charity.name}</span>
              </div>
            )}
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-brand-300">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              Verified Partner
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              FEATURED IMPACT PARTNER
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                {charity.name}
              </h2>
              {charity.category && (
                <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                  {charity.category}
                </span>
              )}
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {charity.description ||
              'Championing grassroots transformation and life-changing opportunities through golf education, mentorship, and conservation programs.'}
          </p>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0 font-bold">
              10%
            </div>
            <span>
              Minimum of 10% of every subscriber&apos;s membership fee can be directed directly to support this organization&apos;s verified programs.
            </span>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to={`/charities/${charity.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-brand-400 to-emerald-400 hover:from-brand-300 hover:to-emerald-300 transition shadow-lg shadow-brand-500/20"
            >
              <span>View Charity Profile & Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {charity.website_url && (
              <a
                href={charity.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition"
              >
                <span>Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCharity;
