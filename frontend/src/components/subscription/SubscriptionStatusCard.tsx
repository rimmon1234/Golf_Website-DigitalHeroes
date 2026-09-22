import React from 'react';
import { Subscription } from '../../types/subscription.js';
import {
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Clock,
  ExternalLink,
  RotateCcw,
  XCircle,
  CreditCard
} from 'lucide-react';

interface SubscriptionStatusCardProps {
  subscription: Subscription;
  isActive: boolean;
  onOpenCancelModal: () => void;
  onReactivate: () => void;
  onOpenPortal: () => void;
  isActionLoading: boolean;
}

export const SubscriptionStatusCard: React.FC<SubscriptionStatusCardProps> = ({
  subscription,
  isActive,
  onOpenCancelModal,
  onReactivate,
  onOpenPortal,
  isActionLoading
}) => {
  const isCancellationScheduled = subscription.cancel_at_period_end && isActive;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              {subscription.plan_type === 'yearly' ? 'Annual Supporter Plan' : 'Monthly Membership Plan'}
            </h2>

            {/* Status Badge */}
            {isCancellationScheduled ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-3.5 h-3.5" /> Cancellation Scheduled
              </span>
            ) : isActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Active Member
              </span>
            ) : subscription.status === 'past_due' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-3.5 h-3.5" /> Payment Required
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                <XCircle className="w-3.5 h-3.5" /> Inactive
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-400">
            {subscription.plan_type === 'yearly'
              ? '$190.00 USD / year (Discounted Annual Rate)'
              : '$19.00 USD / month (Flexible Monthly Plan)'}
          </p>
        </div>

        {/* Stripe Portal Button */}
        <button
          type="button"
          onClick={onOpenPortal}
          disabled={isActionLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-750 hover:text-white transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
          <span>Billing Management</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Calendar className="w-3.5 h-3.5 text-brand-400" />
            <span>Current Period Start</span>
          </div>
          <p className="text-sm font-semibold text-white">
            {formatDate(subscription.current_period_start)}
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Calendar className="w-3.5 h-3.5 text-brand-400" />
            <span>
              {isCancellationScheduled ? 'Access Available Until' : 'Next Renewal Date'}
            </span>
          </div>
          <p className="text-sm font-semibold text-white">
            {formatDate(subscription.current_period_end)}
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            <span>Draw Eligibility</span>
          </div>
          <p className="text-sm font-semibold text-brand-300">
            {isActive ? 'Eligible for Monthly Draws' : 'Subscription Required'}
          </p>
        </div>
      </div>

      {/* Action / Warning Notice Banner */}
      {isCancellationScheduled ? (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-200">
                Your cancellation is scheduled.
              </p>
              <p className="text-xs text-amber-300/80 mt-0.5">
                You retain full member benefits and draw eligibility until{' '}
                {formatDate(subscription.current_period_end)}. You will not be billed again.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onReactivate}
            disabled={isActionLoading}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition cursor-pointer shrink-0 flex items-center gap-1.5 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Keep Membership
          </button>
        </div>
      ) : isActive ? (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onOpenCancelModal}
            disabled={isActionLoading}
            className="text-xs font-semibold text-slate-400 hover:text-rose-400 transition cursor-pointer underline underline-offset-4"
          >
            Cancel Membership at Period End
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default SubscriptionStatusCard;
