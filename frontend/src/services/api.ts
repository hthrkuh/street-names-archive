import axios, { AxiosError } from 'axios';
import type { SearchResponse, SearchMode } from '../types';
import { 
  API_ENDPOINTS, 
  ERROR_CODES, 
  ERROR_MESSAGES, 
  VALIDATION,
  TIMING,
  SearchMode as SearchModeEnum
} from '../constants';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: TIMING.API_TIMEOUT,
});

// Request interceptor for logging (development only)
if (import.meta.env.DEV) {
  api.interceptors.request.use(
    (config) => {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhance error messages for better UX
    if (axios.isAxiosError(error)) {
      if (error.code === ERROR_CODES.TIMEOUT) {
        error.message = ERROR_MESSAGES.TIMEOUT_ERROR;
      } else if (error.code === ERROR_CODES.NETWORK) {
        error.message = ERROR_MESSAGES.NETWORK_ERROR;
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Handle API errors and throw custom ApiError
 * @throws ApiError
 */
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    const message = axiosError.response?.data?.error || 
                   axiosError.response?.data?.message || 
                   axiosError.message || 
                   ERROR_MESSAGES.UNKNOWN_ERROR;
    const statusCode = axiosError.response?.status;
    throw new ApiError(message, statusCode);
  }
  
  if (error instanceof Error) {
    throw new ApiError(error.message);
  }
  
  throw new ApiError(ERROR_MESSAGES.UNKNOWN_ERROR);
};

/**
 * Search for street names
 * @param query - Search query string
 * @param mode - Search mode ('free', 'exact', or 'full')
 * @returns Search response with hits and total count
 * @throws ApiError if request fails
 */
export const searchStreets = async (
  query: string,
  mode: SearchMode = SearchModeEnum.FREE
): Promise<SearchResponse> => {
  try {
    // Validate input
    if (!query || query.trim().length === 0) {
      throw new ApiError(ERROR_MESSAGES.SEARCH_QUERY_EMPTY);
    }
    
    if (query.length > VALIDATION.MAX_QUERY_LENGTH) {
      throw new ApiError(ERROR_MESSAGES.SEARCH_QUERY_TOO_LONG);
    }

    const response = await api.get<SearchResponse>(API_ENDPOINTS.SEARCH, {
      params: { q: query.trim(), mode },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Soft delete a street name record
 * @param id - Document ID to delete
 * @throws ApiError if request fails
 */
export const deleteStreet = async (id: string): Promise<void> => {
  try {
    // Validate input
    if (!id || id.trim().length === 0) {
      throw new ApiError(ERROR_MESSAGES.DOCUMENT_ID_REQUIRED);
    }

    await api.post(`${API_ENDPOINTS.DELETE}/${id.trim()}`);
  } catch (error) {
    handleApiError(error);
  }
};

