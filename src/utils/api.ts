/**
 * Centralized API configuration
 * Ensures all API requests use the correct base URL
 */

// Get the API URL from environment variables, ensuring it ends with /api
const getApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  
  // If the URL doesn't end with /api, add it
  if (!envUrl.endsWith('/api')) {
    // Remove trailing slash if present
    const cleanUrl = envUrl.replace(/\/+$/, '');
    const finalUrl = `${cleanUrl}/api`;
    console.warn(`[API Config] VITE_API_URL doesn't end with /api. Adjusted from "${envUrl}" to "${finalUrl}"`);
    return finalUrl;
  }
  
  return envUrl;
};

export const API_URL = getApiUrl();

// Get the backend base URL (without /api) for serving static files like images
export const getBackendBaseUrl = (): string => {
  return API_URL.replace('/api', '');
};

/**
 * Converts a relative image URL or localhost URL to an absolute URL using the backend base URL
 * Handles:
 * - Relative URLs starting with /uploads/
 * - localhost URLs that need to be converted to production backend URL
 * - Already absolute URLs (returns as-is)
 * - Ensures HTTPS for production URLs
 */
export const getImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl) return '';
  
  // If already an absolute URL (starts with http:// or https://)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // Replace localhost URLs with production backend URL
    if (imageUrl.includes('localhost:3000') || imageUrl.includes('127.0.0.1:3000')) {
      const backendBaseUrl = getBackendBaseUrl();
      // Use https for production URLs (if not localhost)
      const isLocalhost = backendBaseUrl.includes('localhost') || backendBaseUrl.includes('127.0.0.1');
      const httpsBackendUrl = isLocalhost ? backendBaseUrl : backendBaseUrl.replace('http://', 'https://');
      return imageUrl.replace(/https?:\/\/[^/]+/, httpsBackendUrl);
    }
    // For non-localhost URLs, ensure HTTPS if on production (not localhost)
    const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:';
    if (isProduction && imageUrl.startsWith('http://') && !imageUrl.includes('localhost')) {
      return imageUrl.replace('http://', 'https://');
    }
    return imageUrl;
  }
  
  // If it's a relative URL (starts with /uploads/ or /)
  if (imageUrl.startsWith('/')) {
    const backendBaseUrl = getBackendBaseUrl();
    // Use HTTPS for production URLs
    const isLocalhost = backendBaseUrl.includes('localhost') || backendBaseUrl.includes('127.0.0.1');
    const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const finalBackendUrl = (!isLocalhost && isProduction) 
      ? backendBaseUrl.replace('http://', 'https://')
      : backendBaseUrl;
    // Ensure no double slashes
    const cleanImagePath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    const cleanBackendUrl = finalBackendUrl.replace(/\/+$/, '');
    return `${cleanBackendUrl}${cleanImagePath}`;
  }
  
  // If it's just a filename, assume it's in /uploads/products/
  const backendBaseUrl = getBackendBaseUrl();
  const isLocalhost = backendBaseUrl.includes('localhost') || backendBaseUrl.includes('127.0.0.1');
  const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const finalBackendUrl = (!isLocalhost && isProduction)
    ? backendBaseUrl.replace('http://', 'https://')
    : backendBaseUrl;
  const cleanBackendUrl = finalBackendUrl.replace(/\/+$/, '');
  return `${cleanBackendUrl}/uploads/products/${imageUrl}`;
};

// Log the API URL (useful for debugging in both dev and prod)
console.log('[API Config] API_URL configured as:', API_URL);
console.log('[API Config] Backend Base URL configured as:', getBackendBaseUrl());


