import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import KeycloakService from './KeycloakService';

interface AuthContextValue {
  isAuthenticated: boolean;
  token?: string | null;
  user?: any;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => KeycloakService.isAuthenticated());
  const [token, setToken] = useState<string | null>(() => KeycloakService.getToken() ?? null);
  const [user, setUser] = useState<any>(() => {
    try {
      return KeycloakService.getStoredProfile?.() ?? null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    // Assume Keycloak was initialized during bootstrap. Read the instance and hydrate state.
    let mounted = true;
    // Immediate sync from storage/service to avoid UI flash.
    try {
      setIsAuthenticated(!!KeycloakService.isAuthenticated());
      setToken(KeycloakService.getToken() ?? null);
      const stored = KeycloakService.getStoredProfile?.();
      if (stored) setUser(stored);
    } catch (e) {}
    const kc = KeycloakService.getKeycloak();
    if (kc) {
      setIsAuthenticated(!!kc.authenticated);
      setToken(kc.token ?? null);
      if (kc.authenticated) {
        kc.loadUserProfile()
          .then((profile) => {
            if (mounted) setUser(profile);
            try {
              (window as any).RMU_AUTH = {
                token: KeycloakService.getToken(),
                isAuthenticated: KeycloakService.isAuthenticated(),
                login: () => KeycloakService.login(),
                logout: (opts?: any) => KeycloakService.logout(opts),
                profile,
              };
            } catch (e) {}
          })
          .catch(() => {});
      }
    } else {
      console.log('No Keycloak instance found during AuthProvider init, trying stored token');
      // No Keycloak instance: try hydrating from stored token/profile
      const storedToken = KeycloakService.getToken();
      if (storedToken) {
        setIsAuthenticated(true);
        setToken(storedToken ?? null);
        (async () => {
          try {
            const prof = await KeycloakService.getProfile();
            if (mounted) setUser(prof);
            try {
              (window as any).RMU_AUTH = {
                token: KeycloakService.getToken(),
                isAuthenticated: KeycloakService.isAuthenticated(),
                login: () => KeycloakService.login(),
                logout: (opts?: any) => KeycloakService.logout(opts),
                profile: prof,
              };
            } catch (e) {}
          } catch (e) {}
        })();
      }
    }
    // keep window.RMU_AUTH in sync
    (window as any).RMU_AUTH = {
      token: KeycloakService.getToken(),
      isAuthenticated: KeycloakService.isAuthenticated(),
      login: () => KeycloakService.login(),
      logout: (opts?: any) => KeycloakService.logout(opts),
      profile: user,
    };
    // Note: React StrictMode may mount this effect twice in development.

    return () => {
      mounted = false;
    };
  }, []);

  const login = () => KeycloakService.login();
  const logout = () => KeycloakService.logout({ redirectUri: window.location.origin });

  useEffect(() => {
    // Periodically sync token/auth state for UI. Short interval for snappy UI.
    const t = setInterval(() => {
      const currentToken = KeycloakService.getToken();
      setToken(currentToken ?? null);
      setIsAuthenticated(KeycloakService.isAuthenticated());
    }, 100);
    return () => clearInterval(t);
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
