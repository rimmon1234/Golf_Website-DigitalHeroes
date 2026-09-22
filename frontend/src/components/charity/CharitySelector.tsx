import React, { useState, useMemo } from 'react';
import { Charity } from '../../types/charity.js';
import { Check, Search, ExternalLink, Star, ShieldCheck } from 'lucide-react';

interface CharitySelectorProps {
  charities: Charity[];
  selectedCharityId: string | null;
  onSelectCharity: (charityId: string) => void;
  disabled?: boolean;
}

export const CharitySelector: React.FC<CharitySelectorProps> = ({
  charities,
  selectedCharityId,
  onSelectCharity,
  disabled = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Derive unique categories from active charities
  const categories = useMemo(() => {
    const cats = new Set<string>();
    charities.forEach((c) => {
      if (c.category) cats.add(c.category);
    });
    return Array.from(cats).sort();
  }, [charities]);

  const filteredCharities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return charities.filter((c) => {
      const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
      if (!matchCat) return false;
      if (!query) return true;
      return (
        c.name.toLowerCase().includes(query) ||
        (c.category || '').toLowerCase().includes(query) ||
        (c.description || '').toLowerCase().includes(query)
      );
    });
  }, [charities, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-lg text-white">Choose Your Cause</h3>
          <p className="text-xs text-slate-400">
            Select the verified nonprofit partner that will receive your contribution.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search causes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-brand-500 text-slate-950 font-bold shadow-md shadow-brand-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-slate-950 font-bold shadow-md shadow-brand-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Charities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCharities.map((charity) => {
          const isSelected = charity.id === selectedCharityId;
          return (
            <div
              key={charity.id}
              onClick={() => !disabled && onSelectCharity(charity.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-brand-950/20 border-brand-500/80 shadow-lg shadow-brand-500/10 ring-2 ring-brand-500/30'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    {charity.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                        {charity.category}
                      </span>
                    )}
                    <h4 className="font-display font-bold text-base text-white">{charity.name}</h4>
                  </div>

                  {charity.featured && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                      <Star className="w-3 h-3 fill-amber-400" /> Featured
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {charity.description || 'Dedicated to community empowerment through athletic initiatives.'}
                </p>
              </div>

              {/* Action and Selected State */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {charity.website_url ? (
                  <a
                    href={charity.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                    <ShieldCheck className="w-3 h-3" /> Verified Partner
                  </span>
                )}

                <button
                  type="button"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCharity(charity.id);
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Selected</span>
                    </>
                  ) : (
                    <span>Choose Cause</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CharitySelector;
