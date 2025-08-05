// Authentication Module Exports for Module Federation
// This file exposes all authentication-related components and utilities
// for consumption by remote modules

// Core Authentication
export { AuthProvider, useAuth } from './contexts/auth-context';
export { default as authService } from './services/auth-service';

// UI Components
export { default as UserMenu } from './components/auth/user-menu';
export { default as AuthLoader } from './components/auth/auth-loader';
export { default as ProtectedRoute } from './components/auth/protected-route';
export { default as AuthDebug } from './components/auth/auth-debug';

// API Utilities
export { default as useApi } from './hooks/useApi';
export { default as apiClient, ApiClient } from './utils/api-client';

// Utilities and Hooks
import authServiceInstance from './services/auth-service';

export const useAuthService = () => {
  return authServiceInstance;
};

// Authentication Status Helper
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading, user, error } = useAuth();
  return { isAuthenticated, isLoading, user, error };
};

// Role-based Access Control Helpers
export const useRoleCheck = () => {
  const { hasRole, hasAnyRole, getRoles } = useAuth();
  return { hasRole, hasAnyRole, getRoles };
};

// Token Management Helpers
export const useTokenManagement = () => {
  const { getToken, getValidToken, getAuthHeader, getValidAuthHeader, isTokenExpired, updateToken } = useAuth();
  return { getToken, getValidToken, getAuthHeader, getValidAuthHeader, isTokenExpired, updateToken };
};
