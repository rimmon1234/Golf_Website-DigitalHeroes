import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Charity } from '../../types/charity.js';
import { Heart, Star, ArrowRight, ExternalLink } from 'lucide-react';

interface CharityCardProps {
  charity: Charity;
}

export const CharityCard: React.FC<CharityCardProps> = ({ charity }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative flex flex-col bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-brand-500/5">
      {/* Image Container */}
      <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
        {charity.image_url && !imgError ? (
          <img
            src={charity.image_url}
            alt={`${charity.name} logo or initiative`}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-500 p-4">
            <Heart className="w-10 h-10 mb-2 text-brand-400/40" />
            <span className="text-xs font-medium text-slate-400 text-center">{charity.name}</span>
          </div>
        )}

        {/* Featured Badge */}
        {charity.featured && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-[11px] font-bold text-amber-300 shadow-sm">
            <Star className="w-3 h-3 fill-amber-400" /> Featured
          </div>
        )}

        {/* Category Pill */}
        {charity.category && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-medium text-brand-300">
            {charity.category}
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-display font-bold text-base text-white group-hover:text-brand-300 transition-colors line-clamp-1">
            {charity.name}
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
            {charity.description || 'Dedicated to creating positive community impact through golf and education.'}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
          {charity.website_url ? (
            <a
              href={charity.website_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 transition"
              title="Visit official website"
            >
              <span>Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-[11px] text-slate-600">Verified Partner</span>
          )}

          <Link
            to={`/charities/${charity.id}`}
            className="inline-flex items-center gap-1 font-semibold text-brand-400 hover:text-brand-300 transition group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CharityCard;
