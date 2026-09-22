import React from 'react';
import { Score } from '../../types/score.js';
import { Calendar, Edit3, Trash2 } from 'lucide-react';

interface ScoreCardProps {
  score: Score;
  index: number;
  onEdit: (score: Score) => void;
  onDelete: (score: Score) => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  index,
  onEdit,
  onDelete
}) => {
  // Format score_date string cleanly without timezone drift
  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition flex items-center justify-between gap-4">
      {/* Score and Date Information */}
      <div className="flex items-center gap-4">
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center shrink-0 shadow-inner">
          <span className="font-mono text-xl sm:text-2xl font-black text-brand-400 leading-none">
            {score.score}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">
            pts
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
              Round {index + 1}
            </span>
            {index === 0 && (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Most Recent
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formatDate(score.score_date)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(score)}
          title="Edit score"
          aria-label={`Edit score of ${score.score} points on ${score.score_date}`}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(score)}
          title="Delete score"
          aria-label={`Delete score of ${score.score} points on ${score.score_date}`}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ScoreCard;
