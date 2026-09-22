export type PlanType = 'monthly' | 'yearly';

export type SubscriptionStatus =
  | 'active'
  | 'cancelled'
  | 'lapsed'
  | 'past_due'
  | 'unpaid'
  | 'incomplete';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id?: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  subscription_id: string | null;
  stripe_payment_id: string | null;
  stripe_invoice_id?: string | null;
  amount: number;
  currency: string;
  payment_type: 'subscription' | 'charity_donation' | 'prize_payout';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionState {
  subscription: Subscription | null;
  isActive: boolean;
  payments: PaymentRecord[];
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}
