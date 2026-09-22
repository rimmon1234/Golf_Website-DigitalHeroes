-- Migration: 005_phase4_stripe.sql
-- Description: Phase 4 Stripe subscriptions, payments extension, webhook idempotency, and charity allocation snapshots

-- 1. EXTEND SUBSCRIPTIONS TABLE
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS stripe_price_id TEXT NULL,
  ADD COLUMN IF NOT EXISTS last_stripe_event_created_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_price_id ON public.subscriptions(stripe_price_id);

-- 2. EXTEND PAYMENTS TABLE
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS stripe_invoice_id TEXT NULL,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT NULL,
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT NULL;

ALTER TABLE public.payments
  ALTER COLUMN currency SET DEFAULT 'USD';

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_stripe_invoice_id ON public.payments(stripe_invoice_id)
  WHERE stripe_invoice_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON public.payments(stripe_payment_intent_id);

-- 3. CREATE STRIPE WEBHOOK EVENTS TABLE (Idempotency & Auditing)
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  event_created_at TIMESTAMPTZ NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'processed' CHECK (status IN ('processed', 'failed', 'ignored')),
  error_message TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON public.stripe_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created ON public.stripe_webhook_events(created_at DESC);

-- Enable RLS on stripe_webhook_events
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- Only admins/backend service role can access webhook events
CREATE POLICY "Only admins can view webhook events"
ON public.stripe_webhook_events
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can manage webhook events"
ON public.stripe_webhook_events
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. CREATE SUBSCRIPTION CHARITY ALLOCATIONS (Snapshot at Billing Event)
CREATE TABLE IF NOT EXISTS public.subscription_charity_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  subscription_id UUID NULL REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE RESTRICT,
  contribution_percentage NUMERIC(5,2) NOT NULL CHECK (contribution_percentage >= 10.00 AND contribution_percentage <= 100.00),
  allocated_amount NUMERIC(12,2) NOT NULL CHECK (allocated_amount >= 0.00),
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_charity_allocations_user ON public.subscription_charity_allocations(user_id);
CREATE INDEX IF NOT EXISTS idx_charity_allocations_payment ON public.subscription_charity_allocations(payment_id);
CREATE INDEX IF NOT EXISTS idx_charity_allocations_charity ON public.subscription_charity_allocations(charity_id);

-- Enable RLS on subscription_charity_allocations
ALTER TABLE public.subscription_charity_allocations ENABLE ROW LEVEL SECURITY;

-- Users can view their own charity allocations; admins can view all
CREATE POLICY "Users can view own charity allocations"
ON public.subscription_charity_allocations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- Only admins/service role can insert or update allocations
CREATE POLICY "Only admins can manage charity allocations"
ON public.subscription_charity_allocations
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
