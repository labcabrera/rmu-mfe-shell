import { useAuth } from '../contexts/auth-context';

/**
 * Custom hook for authentication with additional utilities
 */
export const useKeycloak = () => {
  const auth = useAuth();

  const checkRole = (role) => {
    return auth.hasRole(role);
  };

  const checkAnyRole = (roles) => {
    return auth.hasAnyRole(roles);
  };

  const checkAllRoles = (roles) => {
    return roles.every(role => auth.hasRole(role));
  };

  const getUserInfo = () => {
    if (!auth.user) return null;
    
    return {
      id: auth.user.id,
      username: auth.user.username,
      email: auth.user.email,
      firstName: auth.user.firstName,
      lastName: auth.user.lastName,
      fullName: auth.user.firstName && auth.user.lastName 
        ? `${auth.user.firstName} ${auth.user.lastName}`
        : auth.user.username || auth.user.email,
      roles: auth.user.roles || [],
      isAdmin: auth.hasRole('admin'),
      isUser: auth.hasRole('user'),
    };
  };

  const createAuthenticatedRequest = async (url, options = {}) => {
    try {
      await auth.updateToken(30);
      
      const headers = {
        'Content-Type': 'application/json',
        ...auth.getAuthHeader(),
        ...options.headers,
      };

      return fetch(url, {
        ...options,
        headers,
      });
    } catch (error) {
      console.error('Failed to create authenticated request:', error);
      auth.login();
      throw error;
    }
  };

  return {
    ...auth,
    checkRole,
    checkAnyRole,
    checkAllRoles,
    getUserInfo,
    createAuthenticatedRequest,
  };
};

export default useKeycloak;
