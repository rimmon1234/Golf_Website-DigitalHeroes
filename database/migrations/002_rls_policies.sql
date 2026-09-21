-- ====================================================================
-- Digital Heroes Platform: Row Level Security (RLS) Policies
-- Migration: 002_rls_policies.sql
-- Description: Enables RLS across all application tables and creates
--              fine-grained access control policies.
-- ====================================================================

-- 1. ADMIN AUTHORIZATION HELPER
-- Defined as SECURITY DEFINER so it evaluates with superuser privileges,
-- avoiding infinite recursion when querying public.users within RLS policies.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. ENABLE ROW LEVEL SECURITY ON ALL APPLICATION TABLES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_charity_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES: public.users
-- Users can view their own profile; Admins can view all profiles
CREATE POLICY "Users can read own profile or admin can read all"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin());

-- Users can update their own profile (role protected by before-update trigger); Admins can update any
CREATE POLICY "Users can update own profile or admin can update any"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (auth.uid() = id OR public.is_admin());

-- 4. POLICIES: public.subscriptions
-- Users can view their own subscriptions; Admins can view all
CREATE POLICY "Users can read own subscriptions or admin read all"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- Only admins/backend service can insert/update/delete subscriptions (preventing client-side spoofing)
CREATE POLICY "Only admins can manage subscriptions"
ON public.subscriptions
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. POLICIES: public.scores
-- Users can view their own scores; Admins can view all
CREATE POLICY "Users can view own scores or admin view all"
ON public.scores
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- Users can insert their own scores
CREATE POLICY "Users can insert own scores"
ON public.scores
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Users can update their own scores
CREATE POLICY "Users can update own scores"
ON public.scores
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Users can delete their own scores
CREATE POLICY "Users can delete own scores"
ON public.scores
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- 6. POLICIES: public.charities
-- Public and authenticated visitors can view active charities; Admins can view all
CREATE POLICY "Anyone can view active charities"
ON public.charities
FOR SELECT
TO anon, authenticated
USING (active = true OR public.is_admin());

-- Only admins can manage charities
CREATE POLICY "Only admins can manage charities"
ON public.charities
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 7. POLICIES: public.charity_events
-- Anyone can view events belonging to active charities; Admins can view all
CREATE POLICY "Anyone can view events of active charities"
ON public.charity_events
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.charities c
    WHERE c.id = charity_id AND c.active = true
  ) OR public.is_admin()
);

-- Only admins can manage charity events
CREATE POLICY "Only admins can manage charity events"
ON public.charity_events
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 8. POLICIES: public.user_charity_preferences
-- Users can read their own preference; Admins can read all
CREATE POLICY "Users can view own charity preference"
ON public.user_charity_preferences
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- Users can insert/update their own preference
CREATE POLICY "Users can insert own charity preference"
ON public.user_charity_preferences
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can update own charity preference"
ON public.user_charity_preferences
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete own charity preference"
ON public.user_charity_preferences
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- 9. POLICIES: public.draws
-- Anyone can read published draws; Admins can read all draws (including draft/simulated)
CREATE POLICY "Anyone can read published draws"
ON public.draws
FOR SELECT
TO anon, authenticated
USING (status = 'published' OR public.is_admin());

-- Only admins can manage draws
CREATE POLICY "Only admins can manage draws"
ON public.draws
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 10. POLICIES: public.draw_entries
-- Users can read their own draw entries; Admins can read all
CREATE POLICY "Users can view own draw entries"
ON public.draw_entries
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- Users can insert their own draw entries
CREATE POLICY "Users can insert own draw entries"
ON public.draw_entries
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 11. POLICIES: public.winners
-- Users can read their own winner records; Admins can read all
CREATE POLICY "Users can view own winner records"
ON public.winners
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- Only admins/backend service can manage winner records and payout statuses
CREATE POLICY "Only admins can manage winner records"
ON public.winners
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 12. POLICIES: public.payments
-- Users can read their own payment records; Admins can read all
CREATE POLICY "Users can view own payment records"
ON public.payments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- Only admins/backend service can write payment records (preventing client spoofing)
CREATE POLICY "Only admins can manage payment records"
ON public.payments
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
