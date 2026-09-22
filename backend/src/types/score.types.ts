import { z } from 'zod';

export interface Score {
  id: string;
  user_id: string;
  score: number;
  score_date: string;
  created_at: string;
  updated_at: string;
}

export const createScoreSchema = z.object({
  score: z
    .number({ required_error: 'Score is required', invalid_type_error: 'Score must be a number' })
    .int('Score must be an integer')
    .min(1, 'Score must be at least 1')
    .max(45, 'Score cannot exceed 45'),
  score_date: z
    .string({ required_error: 'Score date is required' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Score date must be in YYYY-MM-DD format')
    .refine((val) => {
      const parts = val.split('-');
      if (parts.length !== 3) return false;
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (month < 1 || month > 12 || day < 1 || day > 31) return false;
      const d = new Date(year, month - 1, day);
      return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
    }, 'Invalid calendar date')
});

export type CreateScoreInput = z.infer<typeof createScoreSchema>;

export const updateScoreSchema = z.object({
  score: z
    .number({ invalid_type_error: 'Score must be a number' })
    .int('Score must be an integer')
    .min(1, 'Score must be at least 1')
    .max(45, 'Score cannot exceed 45')
    .optional(),
  score_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Score date must be in YYYY-MM-DD format')
    .refine((val) => {
      const parts = val.split('-');
      if (parts.length !== 3) return false;
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (month < 1 || month > 12 || day < 1 || day > 31) return false;
      const d = new Date(year, month - 1, day);
      return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
    }, 'Invalid calendar date')
    .optional()
}).refine((data) => data.score !== undefined || data.score_date !== undefined, {
  message: 'At least one field (score or score_date) must be provided for update'
});

export type UpdateScoreInput = z.infer<typeof updateScoreSchema>;
