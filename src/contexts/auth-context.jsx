import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/auth-service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true; // Flag para evitar actualizaciones de estado en componentes desmontados

    const initAuth = async () => {
      try {
        if (!mounted) return; // Evitar operaciones si el componente se desmontó
        
        setIsLoading(true);
        setError(null);
        
        console.log('Initializing authentication...');
        const authenticated = await authService.init();
        console.log('Authentication result:', authenticated);
        
        if (!mounted) return; // Verificar de nuevo después de la operación async
        
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          console.log('User is authenticated, loading profile...');
          await loadUserProfileInternal();
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error);
        if (mounted) {
          setError(error?.message || 'Authentication initialization failed');
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []);

  // Función interna para cargar el perfil del usuario
  const loadUserProfileInternal = async () => {
    try {
      // Verificar que el usuario esté autenticado antes de cargar el perfil
      if (!authService.isAuthenticated()) {
        console.log('User not authenticated, skipping profile load');
        return;
      }

      const profile = await authService.getUserProfile();
      const token = authService.getParsedToken();
      
      setUser({
        id: profile?.id || null,
        username: profile?.username || null,
        email: profile?.email || null,
        firstName: profile?.firstName || null,
        lastName: profile?.lastName || null,
        roles: authService.getRoles() || [],
        profile: profile || {},
        token: token || {}
      });
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setError(error?.message || 'Failed to load user profile');
      // No hacer throw aquí para evitar que rompa la inicialización
    }
  };

  // Función pública para recargar el perfil del usuario
  const loadUserProfile = async () => {
    await loadUserProfileInternal();
  };

  const login = (options = {}) => {
    setError(null);
    authService.login(options);
  };

  const logout = (options = {}) => {
    setError(null);
    setUser(null);
    setIsAuthenticated(false);
    authService.logout(options);
  };

  const register = (options = {}) => {
    setError(null);
    authService.register(options);
  };

  const hasRole = (role) => {
    try {
      return authService.hasRole(role);
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  };

  const hasAnyRole = (roles) => {
    try {
      if (!Array.isArray(roles)) {
        return false;
      }
      return roles.some(role => hasRole(role));
    } catch (error) {
      console.error('Error checking roles:', error);
      return false;
    }
  };

  const getToken = () => {
    return authService.getToken();
  };

  const getRefreshToken = () => {
    return authService.getRefreshToken();
  };

  const getValidToken = async (minValidity = 30) => {
    try {
      return await authService.getValidToken(minValidity);
    } catch (error) {
      console.error('Error getting valid token:', error);
      setError(error.message);
      return null;
    }
  };

  const getAuthHeader = () => {
    return authService.getAuthHeader();
  };

  const getValidAuthHeader = async (minValidity = 30) => {
    try {
      return await authService.getValidAuthHeader(minValidity);
    } catch (error) {
      console.error('Error getting valid auth header:', error);
      setError(error.message);
      return null;
    }
  };

  const isTokenExpired = (minValidity = 30) => {
    return authService.isTokenExpired(minValidity);
  };

  const updateToken = async (minValidity = 30) => {
    try {
      return await authService.updateToken(minValidity);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    // State
    isAuthenticated,
    isLoading,
    user,
    error,
    
    // Actions
    login,
    logout,
    register,
    loadUserProfile,
    
    // Role management
    hasRole,
    hasAnyRole,
    getRoles: () => authService.getRoles(),
    
    // Token management
    getToken,
    getRefreshToken,
    getValidToken,
    getAuthHeader,
    getValidAuthHeader,
    isTokenExpired,
    updateToken,
    
    // Service reference for advanced usage
    authService
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
