import { getUserSupabase } from '../config/supabase.js';
import { Score, CreateScoreInput, UpdateScoreInput } from '../types/score.types.js';

export class ScoreService {
  /**
   * Enforces that at most 5 scores are retained per user, ordered by score_date DESC, created_at DESC.
   * Any scores beyond the 5 most recent are pruned.
   */
  private async enforceRollingFive(userId: string, jwt: string): Promise<Score[]> {
    const client = getUserSupabase(jwt);

    const { data: allScores, error } = await client
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('score_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const scores = (allScores || []) as Score[];

    if (scores.length > 5) {
      const retained = scores.slice(0, 5);
      const pruneIds = scores.slice(5).map((s) => s.id);

      const { error: delError } = await client
        .from('scores')
        .delete()
        .in('id', pruneIds);

      if (delError) {
        throw delError;
      }

      return retained;
    }

    return scores;
  }

  /**
   * Retrieves all retained scores for the current authenticated user.
   */
  async getUserScores(userId: string, jwt: string): Promise<Score[]> {
    const client = getUserSupabase(jwt);

    const { data, error } = await client
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('score_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []) as Score[];
  }

  /**
   * Adds a new Stableford score, checks for duplicate dates, and applies rolling-five retention.
   */
  async addScore(
    userId: string,
    jwt: string,
    input: CreateScoreInput
  ): Promise<{ added: Score; scores: Score[] }> {
    const client = getUserSupabase(jwt);

    // Explicit duplicate date check before insertion
    const { data: existing } = await client
      .from('scores')
      .select('id')
      .eq('user_id', userId)
      .eq('score_date', input.score_date)
      .maybeSingle();

    if (existing) {
      const conflictError = new Error('A score already exists for this date.');
      (conflictError as unknown as { statusCode: number }).statusCode = 409;
      throw conflictError;
    }

    const { data: inserted, error: insertError } = await client
      .from('scores')
      .insert({
        user_id: userId,
        score: input.score,
        score_date: input.score_date
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        const conflictError = new Error('A score already exists for this date.');
        (conflictError as unknown as { statusCode: number }).statusCode = 409;
        throw conflictError;
      }
      throw insertError;
    }

    const retainedScores = await this.enforceRollingFive(userId, jwt);

    return {
      added: inserted as Score,
      scores: retainedScores
    };
  }

  /**
   * Updates an existing score, validates unique date across other user scores, and reapplies rolling-five logic.
   */
  async updateScore(
    userId: string,
    jwt: string,
    scoreId: string,
    input: UpdateScoreInput
  ): Promise<{ score: Score; scores: Score[] }> {
    const client = getUserSupabase(jwt);

    // Verify ownership and existence
    const { data: existing, error: findError } = await client
      .from('scores')
      .select('*')
      .eq('id', scoreId)
      .eq('user_id', userId)
      .maybeSingle();

    if (findError || !existing) {
      const notFoundError = new Error('Score not found or is unavailable');
      (notFoundError as unknown as { statusCode: number }).statusCode = 404;
      throw notFoundError;
    }

    // If date changed, check for conflict with other scores
    if (input.score_date && input.score_date !== existing.score_date) {
      const { data: conflict } = await client
        .from('scores')
        .select('id')
        .eq('user_id', userId)
        .eq('score_date', input.score_date)
        .neq('id', scoreId)
        .maybeSingle();

      if (conflict) {
        const conflictError = new Error('A score already exists for this date.');
        (conflictError as unknown as { statusCode: number }).statusCode = 409;
        throw conflictError;
      }
    }

    const updatePayload: Partial<Score> = {};
    if (input.score !== undefined) updatePayload.score = input.score;
    if (input.score_date !== undefined) updatePayload.score_date = input.score_date;

    const { data: updated, error: updateError } = await client
      .from('scores')
      .update(updatePayload)
      .eq('id', scoreId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === '23505') {
        const conflictError = new Error('A score already exists for this date.');
        (conflictError as unknown as { statusCode: number }).statusCode = 409;
        throw conflictError;
      }
      throw updateError;
    }

    const retainedScores = await this.enforceRollingFive(userId, jwt);

    return {
      score: updated as Score,
      scores: retainedScores
    };
  }

  /**
   * Deletes a user score by ID after verifying ownership.
   */
  async deleteScore(userId: string, jwt: string, scoreId: string): Promise<void> {
    const client = getUserSupabase(jwt);

    const { data: existing, error: findError } = await client
      .from('scores')
      .select('id')
      .eq('id', scoreId)
      .eq('user_id', userId)
      .maybeSingle();

    if (findError || !existing) {
      const notFoundError = new Error('Score not found or is unavailable');
      (notFoundError as unknown as { statusCode: number }).statusCode = 404;
      throw notFoundError;
    }

    const { error: delError } = await client
      .from('scores')
      .delete()
      .eq('id', scoreId)
      .eq('user_id', userId);

    if (delError) {
      throw delError;
    }
  }
}

export const scoreService = new ScoreService();
