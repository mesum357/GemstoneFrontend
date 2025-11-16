/**
 * Centralized API utility with proper cookie handling
 * Ensures all API requests include credentials for session persistence
 */

import { API_URL } from '@/utils/api';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Custom fetch wrapper that ensures credentials are always included
 * This is essential for cross-domain cookie transmission
 */
export const apiFetch = async (
  url: string,
  options: FetchOptions = {}
): Promise<Response> => {
  const { skipAuth, ...fetchOptions } = options;
  
  // Ensure credentials are always included unless explicitly skipped
  const finalOptions: RequestInit = {
    ...fetchOptions,
    credentials: 'include' as RequestCredentials, // ESSENTIAL for cross-domain cookies
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...fetchOptions.headers,
    },
  };
  
  // Handle FormData requests (remove Content-Type header)
  if (fetchOptions.body instanceof FormData) {
    delete (finalOptions.headers as Record<string, string>)['Content-Type'];
  }
  
  // Construct full URL
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url.startsWith('/') ? url : `/${url}`}`;
  
  // Log request details in development
  if (import.meta.env.DEV) {
    console.log('[API Request]', fetchOptions.method || 'GET', fullUrl);
  }
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(fullUrl, finalOptions);
    
    // Log response details in development
    if (import.meta.env.DEV) {
      const duration = Date.now() - startTime;
      console.log('[API Response]', response.status, fullUrl, `(${duration}ms)`);
    }
    
    // Handle 401 unauthorized (session expired)
    if (response.status === 401 && !skipAuth) {
      console.warn('[API] 401 Unauthorized - Session may have expired');
      // Optionally trigger logout here
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('session-expired');
        window.dispatchEvent(event);
      }
    }
    
    return response;
  } catch (error: any) {
    // Log network errors
    console.error('[API Error]', error.message || 'Network error', fullUrl);
    
    // Detect CORS errors
    if (error.message?.includes('CORS') || error.message?.includes('Failed to fetch')) {
      console.error('[API] CORS error detected - check backend CORS configuration');
    }
    
    throw error;
  }
};

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: (url: string, options?: FetchOptions) => 
    apiFetch(url, { ...options, method: 'GET' }),
  
  post: (url: string, body?: any, options?: FetchOptions) => 
    apiFetch(url, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  
  put: (url: string, body?: any, options?: FetchOptions) => 
    apiFetch(url, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  
  patch: (url: string, body?: any, options?: FetchOptions) => 
    apiFetch(url, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  
  delete: (url: string, options?: FetchOptions) => 
    apiFetch(url, { ...options, method: 'DELETE' }),
};

export default api;

