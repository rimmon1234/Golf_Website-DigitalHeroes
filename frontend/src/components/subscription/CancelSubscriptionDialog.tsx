import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface CancelSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  currentPeriodEnd: string | null;
}

export const CancelSubscriptionDialog: React.FC<CancelSubscriptionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  currentPeriodEnd
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const formattedDate = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'the end of your current billing cycle';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-subscription-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/50"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 id="cancel-subscription-title" className="text-xl font-bold font-display text-white mb-2">
          Cancel Membership?
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          Your membership will remain <span className="text-emerald-400 font-semibold">active until {formattedDate}</span>.
        </p>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          You will retain access to your Stableford score history, charity contribution preference, and entry in the monthly prize draw until this date. You will not be billed again.
        </p>

        <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
          >
            Keep Membership
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Cancelling...</span>
              </>
            ) : (
              <span>Confirm Cancellation</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionDialog;
