import authService from '../services/auth-service';

/**
 * HTTP Client with automatic token injection and management
 */
class ApiClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
  }

  /**
   * Generic request method with automatic token injection
   * @param {string} url - API endpoint URL
   * @param {Object} options - Fetch options
   * @returns {Promise} Response data
   */
  async request(url, options = {}) {
    try {
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      // Get valid token (auto-refresh if needed)
      const authHeader = await authService.getValidAuthHeader();
      
      const config = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          ...(authHeader || {}), // Add auth header if available
        },
      };

      const fullUrl = this.baseURL + url;
      console.log(`🌐 API Request: ${config.method || 'GET'} ${fullUrl}`);
      
      const response = await fetch(fullUrl, config);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.warn('🔒 Unauthorized request - token may be expired');
        throw new Error('Unauthorized - please login again');
      }

      // Handle other HTTP errors
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Return JSON response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(`✅ API Response: ${config.method || 'GET'} ${fullUrl}`, data);
        return data;
      }

      return response;
    } catch (error) {
      console.error(`❌ API Request failed: ${error.message}`, error);
      throw error;
    }
  }

  // Convenience methods
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }

  /**
   * Create a new instance with different base URL
   * @param {string} baseURL - Base URL for the new instance
   * @returns {ApiClient} New ApiClient instance
   */
  static create(baseURL) {
    return new ApiClient(baseURL);
  }
}

// Create default instance
const apiClient = new ApiClient(process.env.REACT_APP_API_BASE_URL || '');

export default apiClient;
export { ApiClient };
