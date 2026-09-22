import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateScoreInput } from '../../types/score.js';
import { PlusCircle, Calendar, Trophy, AlertCircle, Loader2 } from 'lucide-react';

const scoreFormSchema = z.object({
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

type ScoreFormData = z.infer<typeof scoreFormSchema>;

interface ScoreFormProps {
  onSubmitScore: (data: CreateScoreInput) => Promise<void>;
  isSubmitting?: boolean;
}

export const ScoreForm: React.FC<ScoreFormProps> = ({ onSubmitScore, isSubmitting = false }) => {
  const [formError, setFormError] = useState<string | null>(null);

  // Today's date in local YYYY-MM-DD format for max date limit and default
  const todayStr = new Date().toLocaleDateString('en-CA');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ScoreFormData>({
    resolver: zodResolver(scoreFormSchema),
    defaultValues: {
      score_date: todayStr
    }
  });

  const handleFormSubmit = async (data: ScoreFormData) => {
    setFormError(null);
    try {
      await onSubmitScore({
        score: data.score,
        score_date: data.score_date
      });
      reset({
        score_date: todayStr,
        score: undefined as unknown as number
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save score. Please try again.');
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-white">Record New Round</h2>
          <p className="text-xs text-slate-400">
            Log your 18-hole Stableford points (1–45). Only your latest 5 scores are retained.
          </p>
        </div>
      </div>

      {formError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Stableford Score Field */}
          <div className="space-y-2">
            <label htmlFor="score-input" className="block text-xs font-semibold text-slate-300">
              Stableford Points (1–45) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                id="score-input"
                type="number"
                min={1}
                max={45}
                placeholder="e.g. 38"
                disabled={isSubmitting}
                {...register('score', { valueAsNumber: true })}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                  errors.score
                    ? 'border-rose-500/80 focus:ring-rose-500'
                    : 'border-slate-800 focus:ring-brand-500 focus:border-brand-500'
                }`}
              />
            </div>
            {errors.score && (
              <p className="text-rose-400 text-[11px] font-medium">{errors.score.message}</p>
            )}
          </div>

          {/* Score Date Field */}
          <div className="space-y-2">
            <label htmlFor="score-date-input" className="block text-xs font-semibold text-slate-300">
              Round Date <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="score-date-input"
                type="date"
                max={todayStr}
                disabled={isSubmitting}
                {...register('score_date')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-sm text-white focus:outline-none focus:ring-2 transition ${
                  errors.score_date
                    ? 'border-rose-500/80 focus:ring-rose-500'
                    : 'border-slate-800 focus:ring-brand-500 focus:border-brand-500'
                }`}
              />
            </div>
            {errors.score_date && (
              <p className="text-rose-400 text-[11px] font-medium">{errors.score_date.message}</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-brand-400 to-emerald-400 hover:from-brand-300 hover:to-emerald-300 transition shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Recording Round...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Record Score</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScoreForm;
