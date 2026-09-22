export interface Score {
  id: string;
  user_id: string;
  score: number;
  score_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateScoreInput {
  score: number;
  score_date: string;
}

export interface UpdateScoreInput {
  score?: number;
  score_date?: string;
}

export interface ScoresListResponse {
  status: string;
  data: {
    scores: Score[];
    count: number;
  };
}

export interface ScoreMutationResponse {
  status: string;
  message?: string;
  data: {
    added?: Score;
    score?: Score;
    scores: Score[];
  };
}
