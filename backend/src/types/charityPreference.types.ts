import { z } from 'zod';
import { Charity } from './charity.types.js';

export interface UserCharityPreference {
  id: string;
  user_id: string;
  charity_id: string;
  contribution_percentage: number;
  created_at: string;
  updated_at: string;
  charity?: Charity | null;
}

export const updateCharityPreferenceSchema = z.object({
  charity_id: z
    .string({ required_error: 'Charity ID is required' })
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      'Charity ID must be a valid UUID'
    ),
  contribution_percentage: z
    .number({
      required_error: 'Contribution percentage is required',
      invalid_type_error: 'Contribution percentage must be a number'
    })
    .min(10, 'Minimum contribution percentage is 10%')
    .max(100, 'Maximum contribution percentage is 100%')
});

export type UpdateCharityPreferenceInput = z.infer<typeof updateCharityPreferenceSchema>;
