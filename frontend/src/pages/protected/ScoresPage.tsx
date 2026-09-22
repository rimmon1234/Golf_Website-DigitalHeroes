import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/layout/Navbar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import ScoreForm from '../../components/scores/ScoreForm.tsx';
import ScoreList from '../../components/scores/ScoreList.tsx';
import EditScoreDialog from '../../components/scores/EditScoreDialog.tsx';
import DeleteScoreDialog from '../../components/scores/DeleteScoreDialog.tsx';
import ErrorState from '../../components/common/ErrorState.tsx';
import { getScores, addScore, updateScore, deleteScore } from '../../services/api.ts';
import { Score, CreateScoreInput, UpdateScoreInput } from '../../types/score.js';
import { Trophy, CheckCircle } from 'lucide-react';

export const ScoresPage: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Dialog state
  const [editingScore, setEditingScore] = useState<Score | null>(null);
  const [deletingScore, setDeletingScore] = useState<Score | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchScores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getScores();
      setScores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load your scores.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'My Stableford Scores | Digital Heroes';
    fetchScores();
  }, [fetchScores]);

  // Flash success message helper
  const flashSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const handleAddScore = async (input: CreateScoreInput) => {
    setIsSubmitting(true);
    try {
      const res = await addScore(input);
      setScores(res.scores);
      flashSuccess('Score recorded successfully. Your rolling five scores are updated.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateScore = async (id: string, input: UpdateScoreInput) => {
    const res = await updateScore(id, input);
    setScores(res.scores);
    flashSuccess('Score updated successfully.');
  };

  const handleDeleteScore = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteScore(id);
      setScores((prev) => prev.filter((s) => s.id !== id));
      setDeletingScore(null);
      flashSuccess('Score deleted successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete score.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500/20 selection:text-brand-300">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-brand-400 font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>Score Management</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              My Stableford Scores
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Log your 18-hole rounds. Digital Heroes maintains your latest 5 rounds to qualify for monthly prize draws.
            </p>
          </div>
        </div>

        {/* Success Feedback Alert */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Global Error Alert */}
        {error && (
          <ErrorState
            title="Score operation failed"
            message={error}
            onRetry={fetchScores}
          />
        )}

        {/* Loading Skeleton */}
        {loading && !error && (
          <div className="space-y-6">
            <div className="h-44 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
            <div className="h-64 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <div className="space-y-8">
            {/* Record Score Form */}
            <ScoreForm onSubmitScore={handleAddScore} isSubmitting={isSubmitting} />

            {/* Score History and Statistics */}
            <ScoreList
              scores={scores}
              onEditScore={(s) => setEditingScore(s)}
              onDeleteScore={(s) => setDeletingScore(s)}
            />
          </div>
        )}

        {/* Edit Score Modal Dialog */}
        <EditScoreDialog
          score={editingScore}
          isOpen={Boolean(editingScore)}
          onClose={() => setEditingScore(null)}
          onSave={handleUpdateScore}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteScoreDialog
          score={deletingScore}
          isOpen={Boolean(deletingScore)}
          isDeleting={isDeleting}
          onClose={() => setDeletingScore(null)}
          onConfirm={handleDeleteScore}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ScoresPage;
