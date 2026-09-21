-- ====================================================================
-- Digital Heroes Platform: Initial Schema Migration
-- Migration: 001_initial_schema.sql
-- Description: Core relational schema, foreign keys, constraints, triggers, and indexes.
-- ====================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Reusable trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. USERS TABLE (Linked 1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on role for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Prevent unauthorized role changes directly from client UPDATE
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- If role is being changed, ensure only admin or service_role can perform it
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Check if current role is not admin
    IF NOT EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    ) AND (current_user != 'postgres' AND current_user != 'service_role') THEN
      RAISE EXCEPTION 'Unauthorized: Only administrators can modify user roles.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE TRIGGER trg_prevent_role_escalation
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- Trigger: automatically update updated_at on public.users
CREATE OR REPLACE TRIGGER trg_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- 4. AUTOMATIC USER PROFILE CREATION TRIGGER (auth.users -> public.users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    'user' -- Always enforce 'user' role on signup; metadata role injection is ignored
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'lapsed', 'past_due', 'unpaid', 'incomplete')),
  stripe_customer_id TEXT NULL,
  stripe_subscription_id TEXT NULL,
  current_period_start TIMESTAMPTZ NULL,
  current_period_end TIMESTAMPTZ NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  cancelled_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub_id ON public.subscriptions(stripe_subscription_id);

CREATE OR REPLACE TRIGGER trg_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- 6. SCORES TABLE (Stableford golf scores)
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  score_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_score_date UNIQUE (user_id, score_date)
);

CREATE INDEX IF NOT EXISTS idx_scores_user_date ON public.scores(user_id, score_date DESC);

CREATE OR REPLACE TRIGGER trg_scores_updated_at
BEFORE UPDATE ON public.scores
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- 7. CHARITIES TABLE
CREATE TABLE IF NOT EXISTS public.charities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  image_url TEXT,
  website_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_charities_active ON public.charities(active);
CREATE INDEX IF NOT EXISTS idx_charities_featured ON public.charities(featured);

CREATE OR REPLACE TRIGGER trg_charities_updated_at
BEFORE UPDATE ON public.charities
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- 8. CHARITY EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.charity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_charity_events_charity_id ON public.charity_events(charity_id);
CREATE INDEX IF NOT EXISTS idx_charity_events_date ON public.charity_events(event_date);

CREATE OR REPLACE TRIGGER trg_charity_events_updated_at
BEFORE UPDATE ON public.charity_events
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- 9. USER CHARITY PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.user_charity_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE RESTRICT,
  contribution_percentage NUMERIC(5,2) NOT NULL DEFAULT 10.00 CHECK (contribution_percentage >= 10.00 AND contribution_percentage <= 100.00),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_charity_pref UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_charity_pref_user ON public.user_charity_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_charity_pref_charity ON public.user_charity_preferences(charity_id);

CREATE OR REPLACE TRIGGER trg_user_charity_pref_updated_at
BEFORE UPDATE ON public.user_charity_preferences
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- 10. DRAWS TABLE
CREATE TABLE IF NOT EXISTS public.draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_month DATE NOT NULL UNIQUE,
  draw_type TEXT NOT NULL DEFAULT 'monthly' CHECK (draw_type IN ('monthly')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'simulated', 'published', 'completed')),
  winning_numbers INTEGER[] NULL,
  prize_pool NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  rollover_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  published_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_draws_month ON public.draws(draw_month);
CREATE INDEX IF NOT EXISTS idx_draws_status ON public.draws(status);

CREATE OR REPLACE TRIGGER trg_draws_updated_at
BEFORE UPDATE ON public.draws
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- 11. DRAW ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.draw_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  selected_numbers INTEGER[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_draw_user_entry UNIQUE (draw_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_draw_entries_draw_id ON public.draw_entries(draw_id);
CREATE INDEX IF NOT EXISTS idx_draw_entries_user_id ON public.draw_entries(user_id);

-- 12. WINNERS TABLE
CREATE TABLE IF NOT EXISTS public.winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  match_type TEXT NOT NULL CHECK (match_type IN ('3_match', '4_match', '5_match')),
  prize_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  proof_url TEXT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid')),
  verified_at TIMESTAMPTZ NULL,
  paid_at TIMESTAMPTZ NULL,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_winner_draw_user_match UNIQUE (draw_id, user_id, match_type)
);

CREATE INDEX IF NOT EXISTS idx_winners_draw_id ON public.winners(draw_id);
CREATE INDEX IF NOT EXISTS idx_winners_user_id ON public.winners(user_id);
CREATE INDEX IF NOT EXISTS idx_winners_verification ON public.winners(verification_status);
CREATE INDEX IF NOT EXISTS idx_winners_payout ON public.winners(payout_status);

CREATE OR REPLACE TRIGGER trg_winners_updated_at
BEFORE UPDATE ON public.winners
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- 13. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subscription_id UUID NULL REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  stripe_payment_id TEXT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_type TEXT NOT NULL CHECK (payment_type IN ('subscription', 'charity_donation', 'prize_payout')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON public.payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

CREATE OR REPLACE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();
