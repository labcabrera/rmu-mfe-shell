import Keycloak from 'keycloak-js';

// Keycloak configuration from environment variables
const keycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8090/',
  realm: process.env.REACT_APP_KEYCLOAK_REALM || 'rmu-local',
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'rmu-fe-host',
};

// Create Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

// Initialize options with PKCE S256
const initOptions = {
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  pkceMethod: 'S256',
  checkLoginIframe: false,
  flow: 'standard',
};

class AuthService {
  constructor() {
    this.keycloak = keycloak;
    this.initialized = false;
  }

  /**
   * Initialize Keycloak
   * @returns {Promise<boolean>} - Promise that resolves to authentication status
   */
  async init() {
    try {
      console.log('Starting Keycloak initialization...');
      console.log('Keycloak config:', keycloakConfig);
      console.log('Init options:', initOptions);
      
      if (!this.keycloak) {
        throw new Error('Keycloak instance not created');
      }
      
      const authenticated = await this.keycloak.init(initOptions);
      this.initialized = true;
      
      // Set up token refresh
      this.setupTokenRefresh();
      
      console.log('Keycloak initialized successfully:', authenticated ? 'authenticated' : 'not authenticated');
      return Boolean(authenticated);
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
      this.initialized = false;
      // No hacer throw aquí para evitar romper la aplicación cuando Keycloak no esté disponible
      return false;
    }
  }

  /**
   * Login user
   * @param {Object} options - Login options
   */
  login(options = {}) {
    try {
      if (!this.keycloak) {
        console.error('Keycloak not initialized');
        return;
      }
      
      this.keycloak.login({
        redirectUri: window.location.origin,
        ...options
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  /**
   * Logout user
   * @param {Object} options - Logout options
   */
  logout(options = {}) {
    try {
      if (!this.keycloak) {
        console.error('Keycloak not initialized');
        return;
      }
      
      this.keycloak.logout({
        redirectUri: window.location.origin,
        ...options
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  /**
   * Register user
   * @param {Object} options - Registration options
   */
  register(options = {}) {
    try {
      if (!this.keycloak) {
        console.error('Keycloak not initialized');
        return;
      }
      
      this.keycloak.register({
        redirectUri: window.location.origin,
        ...options
      });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    try {
      return this.keycloak && this.keycloak.authenticated === true;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  /**
   * Get user profile
   * @returns {Promise<Object>} - User profile
   */
  async getUserProfile() {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    
    if (!this.initialized) {
      throw new Error('Keycloak not initialized');
    }
    
    try {
      const profile = await this.keycloak.loadUserProfile();
      return profile;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      throw new Error(`Failed to load user profile: ${error.message || error}`);
    }
  }

  /**
   * Get access token
   * @returns {string|null}
   */
  getToken() {
    try {
      return this.keycloak && this.keycloak.token ? this.keycloak.token : null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Get refresh token
   * @returns {string|null}
   */
  getRefreshToken() {
    try {
      return this.keycloak && this.keycloak.refreshToken ? this.keycloak.refreshToken : null;
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Get parsed access token
   * @returns {Object|null}
   */
  getParsedToken() {
    try {
      return this.keycloak && this.keycloak.tokenParsed ? this.keycloak.tokenParsed : null;
    } catch (error) {
      console.error('Error getting parsed token:', error);
      return null;
    }
  }

  /**
   * Get user roles
   * @returns {Array<string>}
   */
  getRoles() {
    try {
      if (!this.keycloak || !this.keycloak.tokenParsed) {
        return [];
      }
      
      const realmRoles = this.keycloak.tokenParsed.realm_access?.roles || [];
      const resourceRoles = Object.values(this.keycloak.tokenParsed.resource_access || {})
        .flatMap(resource => resource?.roles || []);
      
      return [...realmRoles, ...resourceRoles];
    } catch (error) {
      console.error('Error getting roles:', error);
      return [];
    }
  }

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  hasRole(role) {
    try {
      if (!this.keycloak || !role) {
        return false;
      }
      return this.keycloak.hasRealmRole(role) || this.keycloak.hasResourceRole(role);
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  }

  /**
   * Update token if it's about to expire
   * @param {number} minValidity - Minimum validity time in seconds (default: 30)
   * @returns {Promise<boolean>}
   */
  async updateToken(minValidity = 30) {
    try {
      const refreshed = await this.keycloak.updateToken(minValidity);
      if (refreshed) {
        console.log('Token refreshed');
      }
      return refreshed;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
    }
  }

  /**
   * Setup automatic token refresh
   */
  setupTokenRefresh() {
    // Refresh token every 5 minutes if it expires in less than 1 minute
    setInterval(async () => {
      if (this.keycloak.authenticated) {
        try {
          await this.updateToken(60);
        } catch (error) {
          console.error('Auto token refresh failed:', error);
          // Optionally redirect to login
          this.login();
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Get authorization header for API calls
   * @returns {Object}
   */
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Create axios interceptor for automatic token refresh
   * @param {Object} axiosInstance - Axios instance
   */
  setupAxiosInterceptor(axiosInstance) {
    axiosInstance.interceptors.request.use(
      async (config) => {
        if (this.keycloak.authenticated) {
          try {
            await this.updateToken(30);
            config.headers.Authorization = `Bearer ${this.getToken()}`;
          } catch (error) {
            console.error('Token refresh failed:', error);
            this.login();
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && this.keycloak.authenticated) {
          console.log('Unauthorized request, redirecting to login');
          this.login();
        }
        return Promise.reject(error);
      }
    );
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
