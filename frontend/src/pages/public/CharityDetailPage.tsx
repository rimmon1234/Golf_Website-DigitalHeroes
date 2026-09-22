import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import CharityEvents from '../../components/charities/CharityEvents.tsx';
import EmptyState from '../../components/common/EmptyState.tsx';
import { getCharityById } from '../../services/api.ts';
import { CharityDetail } from '../../types/charity.js';
import {
  Heart,
  Star,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export const CharityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [charity, setCharity] = useState<CharityDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState<boolean>(false);

  const fetchCharity = async () => {
    if (!id) {
      setError('Invalid charity ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getCharityById(id);
      if (!data || !data.active) {
        setError('Charity not found or is currently inactive.');
        setCharity(null);
      } else {
        setCharity(data);
        document.title = `${data.name} | Digital Heroes Charity Partner`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to find or load charity profile.');
      setCharity(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharity();
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500/20 selection:text-brand-300">
      <Navbar />

      <main className="flex-1 w-full pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              to="/charities"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Charity Directory</span>
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-6">
              <div className="h-64 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
              <div className="h-32 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
            </div>
          )}

          {/* Error / Not Found State */}
          {!loading && error && (
            <div className="py-12">
              <EmptyState
                title="Charity Not Available"
                message={error || 'The requested charity profile does not exist or is no longer active in our directory.'}
                actionText="Explore All Active Charities"
                actionTo="/charities"
                icon={AlertCircle}
              />
            </div>
          )}

          {/* Charity Profile Details */}
          {!loading && !error && charity && (
            <div className="space-y-10">
              {/* Profile Card Header */}
              <div className="overflow-hidden rounded-3xl bg-slate-900/70 border border-slate-800 relative">
                {/* Visual Header / Banner */}
                <div className="relative h-64 sm:h-80 w-full bg-slate-950 overflow-hidden">
                  {charity.image_url && !imgError ? (
                    <img
                      src={charity.image_url}
                      alt={charity.name}
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 text-slate-600 p-8">
                      <Heart className="w-16 h-16 text-brand-400/40 mb-3" />
                      <span className="font-display font-bold text-lg text-slate-400">{charity.name}</span>
                    </div>
                  )}

                  {/* Gradient Overlay for Readable Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Badges on Top */}
                  <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-brand-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                      Verified Partner
                    </span>
                    {charity.featured && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-xs font-bold text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Profile Information Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      {charity.category && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                          {charity.category}
                        </span>
                      )}
                      <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
                        {charity.name}
                      </h1>
                    </div>

                    {charity.website_url && (
                      <a
                        href={charity.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition shrink-0"
                      >
                        <span>Visit Official Website</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    <h3 className="font-display font-bold text-sm text-slate-300 uppercase tracking-wider">
                      About the Organization & Mission
                    </h3>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      {charity.description ||
                        'Dedicated to creating grassroots impact through community programs, athletic accessibility, and environmental stewardship.'}
                    </p>
                  </div>

                  {/* Impact Notice Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-brand-500/5 border border-brand-500/20 flex items-start gap-3.5 text-xs text-slate-300 leading-relaxed">
                    <Heart className="w-5 h-5 text-brand-400 shrink-0 fill-brand-400/20 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">How Your Subscription Supports This Cause:</span>
                      <p className="text-slate-400 mt-0.5">
                        When you select {charity.name} in your member dashboard, at least 10% of every monthly or annual membership payment is dedicated directly toward this organization&apos;s verified missions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charity Events Section */}
              <div className="pt-2">
                <CharityEvents events={charity.events || []} />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CharityDetailPage;
