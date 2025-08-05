import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/auth-context';

/**
 * Hook for making authenticated API calls with automatic token management
 * @param {string} baseURL - Base URL for API calls (optional)
 * @returns {Object} API utilities and state
 */
export const useApi = (baseURL = '') => {
  const { isAuthenticated, getValidAuthHeader } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generic request method with automatic token injection
   * @param {string} url - API endpoint URL
   * @param {Object} options - Fetch options
   * @returns {Promise} Response data
   */
  const request = useCallback(async (url, options = {}) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      // Get valid auth header (auto-refresh token if needed)
      const authHeader = await getValidAuthHeader();
      
      const config = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          ...(authHeader || {}), // Add auth header if available
        },
      };

      const fullUrl = baseURL + url;
      const response = await fetch(fullUrl, config);

      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Return JSON response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      }

      return response;
    } catch (err) {
      console.error('🚨 API Request failed:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getValidAuthHeader, baseURL]);

  // Convenience methods
  const get = useCallback((url, options = {}) => {
    return request(url, { ...options, method: 'GET' });
  }, [request]);

  const post = useCallback((url, data, options = {}) => {
    return request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }, [request]);

  const put = useCallback((url, data, options = {}) => {
    return request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }, [request]);

  const del = useCallback((url, options = {}) => {
    return request(url, { ...options, method: 'DELETE' });
  }, [request]);

  const patch = useCallback((url, data, options = {}) => {
    return request(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }, [request]);

  return {
    // State
    loading,
    error,
    
    // Methods
    request,
    get,
    post,
    put,
    delete: del,
    patch,
    
    // Utility
    clearError: () => setError(null),
  };
};

export default useApi;
