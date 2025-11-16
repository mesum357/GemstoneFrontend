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

// Log the API URL (useful for debugging in both dev and prod)
console.log('[API Config] API_URL configured as:', API_URL);


