import React from 'react';
import { Score } from '../../types/score.js';
import ScoreCard from './ScoreCard.tsx';
import EmptyState from '../common/EmptyState.tsx';
import { Trophy, CheckCircle2, TrendingUp, Sparkles, Layers } from 'lucide-react';

interface ScoreListProps {
  scores: Score[];
  onEditScore: (score: Score) => void;
  onDeleteScore: (score: Score) => void;
}

export const ScoreList: React.FC<ScoreListProps> = ({
  scores,
  onEditScore,
  onDeleteScore
}) => {
  if (scores.length === 0) {
    return (
      <EmptyState
        title="No Scores Recorded Yet"
        message="Add your first 18-hole Stableford round to start tracking your recent performance and qualify for the monthly draw."
        actionText="Ready to Play"
        icon={Trophy}
      />
    );
  }

  // Calculate simple non-handicap statistics
  const scoreValues = scores.map((s) => s.score);
  const total = scoreValues.reduce((acc, curr) => acc + curr, 0);
  const recentAverage = (total / scores.length).toFixed(1);
  const bestScore = Math.max(...scoreValues);

  return (
    <div className="space-y-6">
      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Retained Count */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Retained Rounds
            </div>
            <div className="font-display font-extrabold text-xl text-white">
              {scores.length} <span className="text-xs text-slate-400 font-normal">/ 5 max</span>
            </div>
          </div>
        </div>

        {/* Recent Average */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Recent Score Average
            </div>
            <div className="font-display font-extrabold text-xl text-white">
              {recentAverage}{' '}
              <span className="text-xs text-slate-400 font-normal">pts</span>
            </div>
          </div>
        </div>

        {/* Best Score */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Best Score in Set
            </div>
            <div className="font-display font-extrabold text-xl text-white">
              {bestScore}{' '}
              <span className="text-xs text-slate-400 font-normal">pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rolling Five Status Bar */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
          <span>
            {scores.length === 5 ? (
              <strong className="text-emerald-300">
                5 of 5 scores active. Complete rolling set qualifies for monthly draw.
              </strong>
            ) : (
              <span>
                {scores.length} of 5 scores logged. Add {5 - scores.length} more to complete your rolling draw basis.
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                num <= scores.length
                  ? 'bg-brand-400 border-brand-300 shadow-sm shadow-brand-500/30'
                  : 'bg-slate-800 border-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scores List Cards */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-sm text-slate-300 uppercase tracking-wider">
          Recorded Rounds (Newest First)
        </h3>
        <div className="space-y-3">
          {scores.map((score, index) => (
            <ScoreCard
              key={score.id}
              score={score}
              index={index}
              onEdit={onEditScore}
              onDelete={onDeleteScore}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreList;
