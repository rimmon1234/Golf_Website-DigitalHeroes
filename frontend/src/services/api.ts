import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { UserProfile } from '../types/auth.js';

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
