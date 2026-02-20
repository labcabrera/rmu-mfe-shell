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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Assume Keycloak was initialized during bootstrap. Read the instance and hydrate state.
    let mounted = true;
    const kc = KeycloakService.getKeycloak();
    if (kc) {
      setIsAuthenticated(!!kc.authenticated);
      setToken(kc.token ?? null);
      if (kc.authenticated) {
        kc.loadUserProfile()
          .then((profile) => mounted && setUser(profile))
          .catch(() => {});
      }
    }
    // Attempt a silent SSO check on load (non-blocking). If found, update state.
    (async () => {
      try {
        const ok = await KeycloakService.silentCheckForSession(5000);
        if (ok && mounted) {
          setIsAuthenticated(!!KeycloakService.getKeycloak()?.authenticated);
          setToken(KeycloakService.getToken() ?? null);
          const prof = await KeycloakService.getProfile();
          if (mounted) setUser(prof);
        }
      } catch (e) {
        // ignore
      }
    })();
    // keep window.RMU_AUTH in sync
    (window as any).RMU_AUTH = {
      token: KeycloakService.getToken(),
      isAuthenticated: KeycloakService.isAuthenticated(),
      login: () => KeycloakService.login(),
      logout: (opts?: any) => KeycloakService.logout(opts),
      profile: user,
    };

    return () => {
      mounted = false;
    };
  }, []);

  const login = () => KeycloakService.login();
  const logout = () => KeycloakService.logout({ redirectUri: window.location.origin });

  useEffect(() => {
    const t = setInterval(() => {
      const currentToken = KeycloakService.getToken();
      setToken(currentToken ?? null);
      setIsAuthenticated(KeycloakService.isAuthenticated());
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
