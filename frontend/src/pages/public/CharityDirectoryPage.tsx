import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import CharityCard from '../../components/charities/CharityCard.tsx';
import FeaturedCharity from '../../components/charities/FeaturedCharity.tsx';
import CharityFilters from '../../components/charities/CharityFilters.tsx';
import ErrorState from '../../components/common/ErrorState.tsx';
import EmptyState from '../../components/common/EmptyState.tsx';
import { getCharities } from '../../services/api.ts';
import { Charity } from '../../types/charity.js';
import { Heart, SearchX } from 'lucide-react';

export const CharityDirectoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state with URL search params
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';

  const updateSearchQuery = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams, { replace: true });
  };

  const updateSelectedCategory = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat && cat !== 'All') {
      newParams.set('category', cat);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams, { replace: true });
  };

  const fetchCharitiesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCharities();
      setCharities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load charities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Charity Directory | Digital Heroes';
    fetchCharitiesData();
  }, []);

  // Derive unique categories from active charities
  const availableCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    charities.forEach((c) => {
      if (c.category) {
        categoriesSet.add(c.category);
      }
    });
    return Array.from(categoriesSet).sort();
  }, [charities]);

  // Find featured charity (or graceful fallback)
  const featuredCharity = useMemo(() => {
    if (charities.length === 0) return null;
    return charities.find((c) => c.featured && c.active) || charities[0];
  }, [charities]);

  // Filtered charities based on query & category
  const filteredCharities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return charities.filter((charity) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (charity.category && charity.category.toLowerCase() === selectedCategory.toLowerCase());

      if (!matchesCategory) return false;

      if (!query) return true;

      const nameMatch = charity.name.toLowerCase().includes(query);
      const descMatch = (charity.description || '').toLowerCase().includes(query);
      const catMatch = (charity.category || '').toLowerCase().includes(query);

      return nameMatch || descMatch || catMatch;
    });
  }, [charities, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500/20 selection:text-brand-300">
      <Navbar />

      <main className="flex-1 w-full pb-20">
        {/* Page Header */}
        <section className="relative overflow-hidden py-14 md:py-20 border-b border-slate-900 bg-slate-950">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-brand-400" />
              <span>Verified Nonprofit Directory</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              Champion Causes That Matter
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Choose your designated beneficiary from our vetted partner directory. A minimum of 10% of every monthly subscription is dedicated straight to their programs.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
          {/* Error State */}
          {error && (
            <ErrorState
              title="Unable to load charity directory"
              message={error}
              onRetry={fetchCharitiesData}
            />
          )}

          {/* Loading Skeleton */}
          {loading && !error && (
            <div className="space-y-8">
              <div className="h-64 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
              <div className="h-14 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-72 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
                ))}
              </div>
            </div>
          )}

          {/* Loaded Content */}
          {!loading && !error && (
            <>
              {/* Featured Charity Banner (shown when no specific search is active) */}
              {!searchQuery && selectedCategory === 'All' && featuredCharity && (
                <div className="space-y-3">
                  <FeaturedCharity charity={featuredCharity} />
                </div>
              )}

              {/* Search & Category Filter Controls */}
              <div className="space-y-4">
                <CharityFilters
                  searchQuery={searchQuery}
                  onSearchChange={updateSearchQuery}
                  selectedCategory={selectedCategory}
                  onCategoryChange={updateSelectedCategory}
                  categories={availableCategories}
                  totalResults={filteredCharities.length}
                />
              </div>

              {/* Grid or Empty Results */}
              {filteredCharities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCharities.map((charity) => (
                    <CharityCard key={charity.id} charity={charity} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No charities match your search"
                  message={`No active partners found for query "${searchQuery}" in category "${selectedCategory}". Try adjusting your keywords or clearing the filter.`}
                  actionText="Clear Filters"
                  onAction={() => {
                    updateSearchQuery('');
                    updateSelectedCategory('All');
                  }}
                  icon={SearchX}
                />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CharityDirectoryPage;
