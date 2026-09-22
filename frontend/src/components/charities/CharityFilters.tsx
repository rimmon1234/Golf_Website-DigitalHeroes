import React from 'react';
import { Search, X, Filter } from 'lucide-react';

interface CharityFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  categories: string[];
  totalResults: number;
}

export const CharityFilters: React.FC<CharityFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalResults
}) => {
  return (
    <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
      {/* Search Bar Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="charity-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search charities by name, cause, or keywords..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            aria-label="Search charities"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Counter */}
        <div className="text-xs text-slate-400 font-medium whitespace-nowrap self-center sm:self-auto">
          Showing <span className="text-white font-bold">{totalResults}</span> {totalResults === 1 ? 'cause' : 'causes'}
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar" role="region" aria-label="Filter by category">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium pr-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </div>

        <button
          type="button"
          onClick={() => onCategoryChange('All')}
          className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-brand-500 text-slate-950 font-bold shadow-md shadow-brand-500/20'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-brand-500 text-slate-950 font-bold shadow-md shadow-brand-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}

        {(selectedCategory !== 'All' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              onCategoryChange('All');
              onSearchChange('');
            }}
            className="text-[11px] text-brand-400 hover:text-brand-300 ml-auto underline cursor-pointer shrink-0"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default CharityFilters;
