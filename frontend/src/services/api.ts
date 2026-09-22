import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { UserProfile } from '../types/auth.js';
import { Charity, CharityDetail, CharityEvent } from '../types/charity.js';
import {
  Score,
  CreateScoreInput,
  UpdateScoreInput,
  ScoresListResponse,
  ScoreMutationResponse
} from '../types/score.js';
import {
  UserCharityPreference,
  UpdateCharityPreferenceInput,
  CharityPreferenceResponse
} from '../types/charityPreference.js';

// Base URL falls back to relative '/api' for Vite dev proxy forwarding
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

let currentAuthToken: string | null = null;

export const setAuthToken = (token: string | null): void => {
  currentAuthToken = token;
};

// Request interceptor: attach bearer token automatically when available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (currentAuthToken && config.headers) {
      config.headers.Authorization = `Bearer ${currentAuthToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Standardize error handling across the app
    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

export const checkBackendHealth = async (): Promise<HealthResponse> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? '/health' : '/api/health';
  const response = await apiClient.get<HealthResponse>(endpoint);
  return response.data;
};

export interface AuthMeResponse {
  status: string;
  data: {
    user: UserProfile;
  };
}

export const fetchCurrentUserProfile = async (token?: string): Promise<UserProfile> => {
  if (token) {
    setAuthToken(token);
  }
  const endpoint = API_BASE_URL.endsWith('/api') ? '/auth/me' : '/api/auth/me';
  const response = await apiClient.get<AuthMeResponse>(endpoint);
  return response.data.data.user;
};

/* ====================================================================
   CHARITIES SERVICE
   ==================================================================== */

export interface CharitiesListResponse {
  status: string;
  data: {
    charities: Charity[];
    count: number;
  };
}

export interface CharityDetailResponse {
  status: string;
  data: {
    charity: CharityDetail;
  };
}

export interface CharityEventsResponse {
  status: string;
  data: {
    events: CharityEvent[];
    count: number;
  };
}

/**
 * Fetches all active charities from the backend API.
 */
export const getCharities = async (): Promise<Charity[]> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? '/charities' : '/api/charities';
  const response = await apiClient.get<CharitiesListResponse>(endpoint);
  return response.data.data.charities;
};

/**
 * Fetches a single active charity with associated events by ID.
 */
export const getCharityById = async (id: string): Promise<CharityDetail> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? `/charities/${id}` : `/api/charities/${id}`;
  const response = await apiClient.get<CharityDetailResponse>(endpoint);
  return response.data.data.charity;
};

/**
 * Fetches events for a specific active charity.
 */
export const getCharityEvents = async (id: string): Promise<CharityEvent[]> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? `/charities/${id}/events` : `/api/charities/${id}/events`;
  const response = await apiClient.get<CharityEventsResponse>(endpoint);
  return response.data.data.events;
};

/* ====================================================================
   SCORES SERVICE (Phase 3)
   ==================================================================== */

/**
 * Fetches the authenticated user's retained Stableford scores (max 5, score_date DESC).
 */
export const getScores = async (): Promise<Score[]> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? '/scores' : '/api/scores';
  const response = await apiClient.get<ScoresListResponse>(endpoint);
  return response.data.data.scores;
};

/**
 * Submits a new Stableford score and enforces the rolling-five rule.
 */
export const addScore = async (data: CreateScoreInput): Promise<{ added: Score; scores: Score[] }> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? '/scores' : '/api/scores';
  const response = await apiClient.post<ScoreMutationResponse>(endpoint, data);
  return {
    added: response.data.data.added!,
    scores: response.data.data.scores
  };
};

/**
 * Updates an existing score value or date.
 */
export const updateScore = async (
  id: string,
  data: UpdateScoreInput
): Promise<{ score: Score; scores: Score[] }> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? `/scores/${id}` : `/api/scores/${id}`;
  const response = await apiClient.patch<ScoreMutationResponse>(endpoint, data);
  return {
    score: response.data.data.score!,
    scores: response.data.data.scores
  };
};

/**
 * Deletes a user score.
 */
export const deleteScore = async (id: string): Promise<void> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? `/scores/${id}` : `/api/scores/${id}`;
  await apiClient.delete(endpoint);
};

/* ====================================================================
   CHARITY PREFERENCE SERVICE (Phase 3)
   ==================================================================== */

/**
 * Fetches the authenticated user's selected charity preference.
 */
export const getCharityPreference = async (): Promise<UserCharityPreference | null> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? '/charity-preference' : '/api/charity-preference';
  const response = await apiClient.get<CharityPreferenceResponse>(endpoint);
  return response.data.data.preference;
};

/**
 * Updates or sets the user's single charity preference and contribution percentage.
 */
export const updateCharityPreference = async (
  data: UpdateCharityPreferenceInput
): Promise<UserCharityPreference> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? '/charity-preference' : '/api/charity-preference';
  const response = await apiClient.put<CharityPreferenceResponse>(endpoint, data);
  return response.data.data.preference!;
};

/* ====================================================================
   SUBSCRIPTIONS & BILLING SERVICE (Phase 4)
   ==================================================================== */

interface CheckoutApiResponse {
  status: string;
  data: {
    checkoutUrl: string;
    sessionId: string;
  };
}

interface SubscriptionApiResponse {
  status: string;
  data: {
    subscription: import('../types/subscription.js').Subscription | null;
    isActive: boolean;
    payments: import('../types/subscription.js').PaymentRecord[];
  };
}

interface SubscriptionMutationResponse {
  status: string;
  message?: string;
  data: {
    subscription: import('../types/subscription.js').Subscription;
  };
}

interface PortalApiResponse {
  status: string;
  data: {
    portalUrl: string;
  };
}

/**
 * Creates a Stripe Checkout Session for subscription.
 */
export const createCheckoutSession = async (
  planType: 'monthly' | 'yearly'
): Promise<{ checkoutUrl: string; sessionId: string }> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? '/subscriptions/checkout' : '/api/subscriptions/checkout';
  const response = await apiClient.post<CheckoutApiResponse>(endpoint, { planType });
  return response.data.data;
};

/**
 * Retrieves the authenticated user's current subscription status and payment history.
 */
export const getMySubscription = async (): Promise<{
  subscription: import('../types/subscription.js').Subscription | null;
  isActive: boolean;
  payments: import('../types/subscription.js').PaymentRecord[];
}> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? '/subscriptions/me' : '/api/subscriptions/me';
  const response = await apiClient.get<SubscriptionApiResponse>(endpoint);
  return response.data.data;
};

/**
 * Schedules subscription cancellation at the end of the billing period.
 */
export const cancelSubscription = async (): Promise<import('../types/subscription.js').Subscription> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? '/subscriptions/cancel' : '/api/subscriptions/cancel';
  const response = await apiClient.post<SubscriptionMutationResponse>(endpoint);
  return response.data.data.subscription;
};

/**
 * Reactivates a subscription pending cancellation.
 */
export const reactivateSubscription = async (): Promise<import('../types/subscription.js').Subscription> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? '/subscriptions/reactivate' : '/api/subscriptions/reactivate';
  const response = await apiClient.post<SubscriptionMutationResponse>(endpoint);
  return response.data.data.subscription;
};

/**
 * Generates a Stripe Customer Portal session URL.
 */
export const createCustomerPortalSession = async (): Promise<string> => {
  const endpoint = API_BASE_URL.endsWith('/api') ? '/subscriptions/portal' : '/api/subscriptions/portal';
  const response = await apiClient.post<PortalApiResponse>(endpoint);
  return response.data.data.portalUrl;
};

