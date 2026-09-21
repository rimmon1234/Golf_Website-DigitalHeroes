import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Base URL falls back to relative '/api' for Vite dev proxy forwarding
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
  // If baseURL is '/api', call '/health' so the full path is '/api/health'
  const endpoint = API_BASE_URL.endsWith('/api') ? '/health' : '/api/health';
  const response = await apiClient.get<HealthResponse>(endpoint);
  return response.data;
};
