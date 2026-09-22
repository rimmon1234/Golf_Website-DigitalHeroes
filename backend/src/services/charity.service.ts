import { getPublicSupabase, getAdminSupabase } from '../config/supabase.js';
import { Charity, CharityDetail, CharityEvent } from '../types/charity.types.js';

export class CharityService {
  private getClient() {
    try {
      return getPublicSupabase();
    } catch {
      return getAdminSupabase();
    }
  }

  /**
   * Retrieves all active charities, prioritizing featured charities first.
   */
  async getActiveCharities(): Promise<Charity[]> {
    const client = this.getClient();
    const { data, error } = await client
      .from('charities')
      .select('*')
      .eq('active', true)
      .order('featured', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch charities: ${error.message}`);
    }

    return (data || []) as Charity[];
  }

  /**
   * Retrieves a single active charity by its ID, including upcoming events.
   * If the charity is inactive or does not exist, returns null.
   */
  async getCharityById(id: string): Promise<CharityDetail | null> {
    const client = this.getClient();

    // Fetch the active charity
    const { data: charity, error: charityError } = await client
      .from('charities')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single();

    if (charityError || !charity) {
      return null;
    }

    // Fetch associated charity events
    const { data: events, error: eventsError } = await client
      .from('charity_events')
      .select('*')
      .eq('charity_id', id)
      .order('event_date', { ascending: true });

    if (eventsError) {
      throw new Error(`Failed to fetch charity events: ${eventsError.message}`);
    }

    return {
      ...(charity as Charity),
      events: (events || []) as CharityEvent[]
    };
  }

  /**
   * Retrieves events for a specific active charity.
   */
  async getCharityEvents(charityId: string): Promise<CharityEvent[]> {
    const client = this.getClient();

    // Verify charity is active first
    const { data: charity } = await client
      .from('charities')
      .select('id, active')
      .eq('id', charityId)
      .eq('active', true)
      .single();

    if (!charity) {
      return [];
    }

    const { data: events, error } = await client
      .from('charity_events')
      .select('*')
      .eq('charity_id', charityId)
      .order('event_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch charity events: ${error.message}`);
    }

    return (events || []) as CharityEvent[];
  }
}

export const charityService = new CharityService();
