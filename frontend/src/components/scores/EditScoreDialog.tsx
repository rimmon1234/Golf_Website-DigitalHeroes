import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Score, UpdateScoreInput } from '../../types/score.js';
import { X, Calendar, Edit3, AlertCircle, Loader2 } from 'lucide-react';

const editScoreSchema = z.object({
  score: z
    .number({ invalid_type_error: 'Score must be a number' })
    .int('Score must be a whole number')
    .min(1, 'Score must be between 1 and 45')
    .max(45, 'Score must be between 1 and 45'),
  score_date: z
    .string({ required_error: 'Please select a score date' })
    .min(1, 'Please select a score date')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date in YYYY-MM-DD format')
});

type EditScoreFormData = z.infer<typeof editScoreSchema>;

interface EditScoreDialogProps {
  score: Score | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateScoreInput) => Promise<void>;
}

export const EditScoreDialog: React.FC<EditScoreDialogProps> = ({
  score,
  isOpen,
  onClose,
  onSave
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const todayStr = new Date().toLocaleDateString('en-CA');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EditScoreFormData>({
    resolver: zodResolver(editScoreSchema)
  });

  useEffect(() => {
    if (score) {
      reset({
        score: score.score,
        score_date: score.score_date
      });
      setError(null);
    }
  }, [score, reset]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !score) return null;

  const handleFormSubmit = async (data: EditScoreFormData) => {
    setError(null);
    setIsSaving(true);
    try {
      await onSave(score.id, {
        score: data.score,
        score_date: data.score_date
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update score.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-score-title"
    >
      <div className="relative w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-6">
        {/* Dialog Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <h3 id="edit-score-title" className="font-display font-bold text-base text-white">
              Edit Recorded Score
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label htmlFor="edit-score-input" className="block text-xs font-semibold text-slate-300">
              Stableford Points (1–45)
            </label>
            <input
              id="edit-score-input"
              type="number"
              min={1}
              max={45}
              disabled={isSaving}
              {...register('score', { valueAsNumber: true })}
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-white focus:outline-none focus:ring-2 transition ${
                errors.score
                  ? 'border-rose-500/80 focus:ring-rose-500'
                  : 'border-slate-800 focus:ring-brand-500'
              }`}
            />
            {errors.score && (
              <p className="text-rose-400 text-[11px] font-medium">{errors.score.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-score-date" className="block text-xs font-semibold text-slate-300">
              Round Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="edit-score-date"
                type="date"
                max={todayStr}
                disabled={isSaving}
                {...register('score_date')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-white focus:outline-none focus:ring-2 transition ${
                  errors.score_date
                    ? 'border-rose-500/80 focus:ring-rose-500'
                    : 'border-slate-800 focus:ring-brand-500'
                }`}
              />
            </div>
            {errors.score_date && (
              <p className="text-rose-400 text-[11px] font-medium">{errors.score_date.message}</p>
            )}
          </div>

          {/* Dialog Action Buttons */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-brand-400 to-emerald-400 hover:from-brand-300 hover:to-emerald-300 transition shadow-md shadow-brand-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Score</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScoreDialog;
