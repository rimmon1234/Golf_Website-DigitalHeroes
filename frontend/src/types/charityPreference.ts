import { Charity } from './charity.js';

export interface UserCharityPreference {
  id: string;
  user_id: string;
  charity_id: string;
  contribution_percentage: number;
  created_at: string;
  updated_at: string;
  charity?: Charity | null;
}

export interface UpdateCharityPreferenceInput {
  charity_id: string;
  contribution_percentage: number;
}

export interface CharityPreferenceResponse {
  status: string;
  message?: string;
  data: {
    preference: UserCharityPreference | null;
  };
}
