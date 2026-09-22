-- ====================================================================
-- Digital Heroes Platform: Phase 3 Score Functions Migration
-- Migration: 004_phase3_score_functions.sql
-- Description: Rolling-five score retention trigger and helper functions.
-- ====================================================================

-- Trigger function: Enforce that at most 5 scores are retained per user,
-- keeping only the 5 newest records by score_date DESC, created_at DESC.
CREATE OR REPLACE FUNCTION public.enforce_rolling_five()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.scores
  WHERE id IN (
    SELECT id FROM public.scores
    WHERE user_id = NEW.user_id
    ORDER BY score_date DESC, created_at DESC
    OFFSET 5
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Attach trigger to public.scores for both INSERT and UPDATE operations
DROP TRIGGER IF EXISTS trg_scores_rolling_five ON public.scores;
CREATE TRIGGER trg_scores_rolling_five
AFTER INSERT OR UPDATE ON public.scores
FOR EACH ROW EXECUTE FUNCTION public.enforce_rolling_five();
