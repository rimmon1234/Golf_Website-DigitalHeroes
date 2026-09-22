import React from 'react';
import { PaymentRecord } from '../../types/subscription.js';
import { CreditCard, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface PaymentHistoryProps {
  payments: PaymentRecord[];
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
  if (payments.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <CreditCard className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">No Invoices Yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          When your subscription billing cycles execute, your payment receipts and invoice records will appear here.
        </p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
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
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-5 h-5 text-brand-400" />
        <h3 className="text-lg font-bold font-display text-white">Billing History</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Description</th>
              <th className="pb-3 font-semibold">Amount</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="py-3.5 text-slate-300 font-medium whitespace-nowrap">
                  {formatDate(payment.paid_at || payment.created_at)}
                </td>
                <td className="py-3.5 text-white font-medium">
                  {payment.payment_type === 'subscription' ? 'Digital Heroes Membership' : payment.payment_type}
                </td>
                <td className="py-3.5 font-bold font-display text-white">
                  ${payment.amount.toFixed(2)} {payment.currency}
                </td>
                <td className="py-3.5">
                  {payment.status === 'paid' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Paid
                    </span>
                  ) : payment.status === 'failed' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <AlertCircle className="w-3 h-3" /> Failed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </td>
                <td className="py-3.5 text-right font-mono text-[11px] text-slate-400">
                  {payment.stripe_payment_id ? payment.stripe_payment_id.slice(0, 14) + '...' : payment.id.slice(0, 8)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
