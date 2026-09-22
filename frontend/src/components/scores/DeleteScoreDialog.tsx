import React, { useEffect } from 'react';
import { Score } from '../../types/score.js';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface DeleteScoreDialogProps {
  score: Score | null;
  isOpen: boolean;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: (scoreId: string) => Promise<void>;
}

export const DeleteScoreDialog: React.FC<DeleteScoreDialogProps> = ({
  score,
  isOpen,
  isDeleting = false,
  onClose,
  onConfirm
}) => {
  // ESC key listener to close
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="relative w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="delete-dialog-title" className="font-display font-bold text-base text-white">
                Delete Recorded Score?
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">This action cannot be undone.</p>
            </div>
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

        {/* Score Details Callout */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between text-xs">
          <span className="text-slate-400">Score to be deleted:</span>
          <span className="font-semibold text-white">
            <strong className="text-brand-400 font-mono text-sm">{score.score} pts</strong> on{' '}
            {score.score_date}
          </span>
        </div>

        {/* Dialog Actions */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(score.id)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition shadow-md shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Score</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteScoreDialog;
