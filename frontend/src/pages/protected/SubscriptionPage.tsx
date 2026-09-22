import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/layout/Navbar.tsx';
import Footer from '../../components/layout/Footer.tsx';
import SubscriptionPlanCard from '../../components/subscription/SubscriptionPlanCard.tsx';
import SubscriptionStatusCard from '../../components/subscription/SubscriptionStatusCard.tsx';
import CancelSubscriptionDialog from '../../components/subscription/CancelSubscriptionDialog.tsx';
import PaymentHistory from '../../components/subscription/PaymentHistory.tsx';
import LoadingState from '../../components/common/LoadingState.tsx';
import ErrorState from '../../components/common/ErrorState.tsx';
import { SUBSCRIPTION_PLANS } from '../../config/pricing.js';
import {
  getMySubscription,
  createCheckoutSession,
  cancelSubscription,
  reactivateSubscription,
  createCustomerPortalSession
} from '../../services/api.ts';
import { Subscription, PaymentRecord, PlanType } from '../../types/subscription.js';
import { ShieldCheck, Heart, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';

export const SubscriptionPage: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchSubscriptionData = useCallback(async () => {
    try {
      setError(null);
      const data = await getMySubscription();
      setSubscription(data.subscription);
      setIsActive(data.isActive);
      setPayments(data.payments);
    } catch (err: unknown) {
      console.error('Failed to load subscription status:', err);
      setError('Unable to load subscription details. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Membership & Billing | Digital Heroes';
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  // Handle Checkout creation
  const handleSubscribe = async (planType: PlanType) => {
    try {
      setCheckoutLoading(true);
      setError(null);
      const { checkoutUrl } = await createCheckoutSession(planType);
      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (err: unknown) {
      console.error('Checkout creation error:', err);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Unable to initialize Stripe checkout. Please try again.';
      setError(msg);
      setCheckoutLoading(false);
    }
  };

  // Handle Cancellation
  const handleConfirmCancel = async () => {
    try {
      setActionLoading(true);
      const updated = await cancelSubscription();
      setSubscription(updated);
      setCancelModalOpen(false);
      setFeedbackMessage('Your membership is scheduled for cancellation at the end of the billing period.');
    } catch (err: unknown) {
      console.error('Cancellation error:', err);
      setError('Failed to schedule cancellation. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reactivation
  const handleReactivate = async () => {
    try {
      setActionLoading(true);
      const updated = await reactivateSubscription();
      setSubscription(updated);
      setFeedbackMessage('Your membership has been reactivated successfully!');
    } catch (err: unknown) {
      console.error('Reactivation error:', err);
      setError('Failed to reactivate membership. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Customer Portal
  const handleOpenPortal = async () => {
    try {
      setActionLoading(true);
      const portalUrl = await createCustomerPortalSession();
      window.location.href = portalUrl;
    } catch (err: unknown) {
      console.error('Customer Portal error:', err);
      setError('Stripe Billing Portal is currently unavailable. Please try again later.');
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Heroes Membership</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Membership & Billing
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Track your golf scores, support verified charities, and participate in our monthly prize draws.
          </p>
        </div>

        {/* Feedback / Notification Banner */}
        {feedbackMessage && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-xs text-emerald-400 hover:text-white cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8">
            <ErrorState message={error} onRetry={fetchSubscriptionData} />
          </div>
        )}

        {loading ? (
          <LoadingState message="Loading your membership status..." />
        ) : (
          <div className="space-y-12">
            {/* If Member has active subscription or cancellation scheduled */}
            {subscription && (isActive || subscription.cancel_at_period_end) ? (
              <div className="space-y-8">
                <SubscriptionStatusCard
                  subscription={subscription}
                  isActive={isActive}
                  onOpenCancelModal={() => setCancelModalOpen(true)}
                  onReactivate={handleReactivate}
                  onOpenPortal={handleOpenPortal}
                  isActionLoading={actionLoading}
                />

                <PaymentHistory payments={payments} />
              </div>
            ) : (
              /* If Member does not have an active subscription */
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <SubscriptionPlanCard
                      key={plan.id}
                      plan={plan}
                      isLoading={checkoutLoading}
                      onSubscribe={handleSubscribe}
                    />
                  ))}
                </div>

                {/* Membership Highlights */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
                  <h3 className="text-lg font-bold font-display text-white mb-6 text-center">
                    Why Join Digital Heroes?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">Rolling-Five Golf Tracker</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Record your rounds with official Stableford scoring. We maintain your latest 5 rounds automatically.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">Guaranteed Charity Impact</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          A minimum of 10% of every subscription goes directly to your chosen verified charity cause.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">Monthly Prize Pool Draws</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Active members enter each monthly draw with multi-tier cash prizes and jackpot rollovers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Previous Payments if any */}
                {payments.length > 0 && <PaymentHistory payments={payments} />}
              </div>
            )}
          </div>
        )}

        {/* Cancellation Modal */}
        <CancelSubscriptionDialog
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={handleConfirmCancel}
          isSubmitting={actionLoading}
          currentPeriodEnd={subscription?.current_period_end || null}
        />
      </main>

      <Footer />
    </div>
  );
};

export default SubscriptionPage;
