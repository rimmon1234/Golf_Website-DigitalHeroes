import { getUserSupabase } from '../config/supabase.js';
import {
  UserCharityPreference,
  UpdateCharityPreferenceInput
} from '../types/charityPreference.types.js';

export class CharityPreferenceService {
  /**
   * Retrieves the authenticated user's current charity preference with charity details.
   */
  async getPreference(userId: string, jwt: string): Promise<UserCharityPreference | null> {
    const client = getUserSupabase(jwt);

    const { data, error } = await client
      .from('user_charity_preferences')
      .select('*, charity:charities(*)')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as UserCharityPreference | null;
  }

  /**
   * Updates or inserts (upserts) the user's single charity preference.
   * Validates that the chosen charity is active and publicly available.
   */
  async updatePreference(
    userId: string,
    jwt: string,
    input: UpdateCharityPreferenceInput
  ): Promise<UserCharityPreference> {
    const client = getUserSupabase(jwt);

    // Verify charity is active and exists
    const { data: charity, error: charityError } = await client
      .from('charities')
      .select('id, name, active')
      .eq('id', input.charity_id)
      .maybeSingle();

    if (charityError || !charity || !charity.active) {
      const invalidError = new Error('Selected charity is invalid or currently inactive');
      (invalidError as unknown as { statusCode: number }).statusCode = 400;
      throw invalidError;
    }

    // Upsert single row per user
    const { data, error } = await client
      .from('user_charity_preferences')
      .upsert(
        {
          user_id: userId,
          charity_id: input.charity_id,
          contribution_percentage: input.contribution_percentage,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      )
      .select('*, charity:charities(*)')
      .single();

    if (error) {
      throw error;
    }

    return data as UserCharityPreference;
  }
}

export const charityPreferenceService = new CharityPreferenceService();
