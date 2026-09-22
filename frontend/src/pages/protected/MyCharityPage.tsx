import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/layout/Navbar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import CharitySelector from '../../components/charity/CharitySelector.tsx';
import ContributionControl from '../../components/charity/ContributionControl.tsx';
import ErrorState from '../../components/common/ErrorState.tsx';
import { getCharities, getCharityPreference, updateCharityPreference } from '../../services/api.ts';
import { Charity } from '../../types/charity.js';
import { UserCharityPreference } from '../../types/charityPreference.js';
import { Heart, CheckCircle2, ShieldCheck, Save, Loader2 } from 'lucide-react';

export const MyCharityPage: React.FC = () => {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [currentPreference, setCurrentPreference] = useState<UserCharityPreference | null>(null);

  // Form edit state
  const [selectedCharityId, setSelectedCharityId] = useState<string | null>(null);
  const [contributionPercentage, setContributionPercentage] = useState<number>(10);

  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [charitiesList, preference] = await Promise.all([
        getCharities(),
        getCharityPreference()
      ]);

      setCharities(charitiesList);
      setCurrentPreference(preference);

      if (preference) {
        setSelectedCharityId(preference.charity_id);
        setContributionPercentage(Number(preference.contribution_percentage));
      } else if (charitiesList.length > 0) {
        // Default to the featured charity or first charity if none selected
        const featured = charitiesList.find((c) => c.featured && c.active) || charitiesList[0];
        setSelectedCharityId(featured.id);
        setContributionPercentage(10);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load charity preferences.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'My Charity Partner | Digital Heroes';
    loadData();
  }, [loadData]);

  const handleSavePreference = async () => {
    if (!selectedCharityId) {
      setError('Please select a charity partner to support.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateCharityPreference({
        charity_id: selectedCharityId,
        contribution_percentage: contributionPercentage
      });

      setCurrentPreference(updated);
      setSuccessMessage('Your charity preference has been updated successfully.');

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update charity preference.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCharity = charities.find((c) => c.id === selectedCharityId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500/20 selection:text-brand-300">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Page Header */}
        <div className="border-b border-slate-800/80 pb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-brand-400 font-bold">
            <Heart className="w-3.5 h-3.5 fill-brand-400/20" />
            <span>Philanthropy Preference</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            My Charity Selection
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Choose your designated charity and allocate your contribution percentage. Every round you play generates direct impact.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <ErrorState
            title="Failed to load or save charity preference"
            message={error}
            onRetry={loadData}
          />
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="space-y-6">
            <div className="h-44 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
            <div className="h-64 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <div className="space-y-8">
            {/* Current Active Selection Card */}
            {currentPreference && currentPreference.charity ? (
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-brand-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl shadow-brand-500/5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Current Active Beneficiary</span>
                  </div>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                    {currentPreference.charity.name}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-lg">
                    {currentPreference.charity.description ||
                      'Verified community organization empowering positive change through sports.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center shrink-0 self-stretch sm:self-auto">
                  <div className="font-mono font-black text-3xl text-brand-400">
                    {currentPreference.contribution_percentage}%
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
                    Revenue Allocation
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    No Charity Partner Selected Yet
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select a cause below and choose your contribution percentage to designate where your membership funds will go.
                  </p>
                </div>
              </div>
            )}

            {/* Contribution Percentage Slider */}
            <ContributionControl
              value={contributionPercentage}
              onChange={(val) => setContributionPercentage(val)}
              disabled={isSaving}
            />

            {/* Charity Selector Grid */}
            <CharitySelector
              charities={charities}
              selectedCharityId={selectedCharityId}
              onSelectCharity={(id) => setSelectedCharityId(id)}
              disabled={isSaving}
            />

            {/* Save Floating Bar / Action Section */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-6 z-20 shadow-2xl backdrop-blur-md">
              <div className="text-xs text-slate-300">
                <span>Selected: </span>
                <strong className="text-white">
                  {selectedCharity ? selectedCharity.name : 'None selected'}
                </strong>{' '}
                at <strong className="text-brand-400 font-mono">{contributionPercentage}%</strong> allocation
              </div>

              <button
                type="button"
                onClick={handleSavePreference}
                disabled={isSaving || !selectedCharityId}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-brand-400 to-emerald-400 hover:from-brand-300 hover:to-emerald-300 transition shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Preference...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Charity Preference</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyCharityPage;
