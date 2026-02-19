import Keycloak, { KeycloakInstance } from 'keycloak-js';

let keycloak: KeycloakInstance | null = null;

const REFRESH_INTERVAL = 20; // seconds to try refresh before expiring

export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

const defaultConfig: KeycloakConfig = {
  url: 'https://auth.labcabrera.com/',
  realm: 'rmu',
  clientId: 'rmu-mfe',
};

export async function initKeycloak(config: Partial<KeycloakConfig> = {}) {
  const cfg = { ...defaultConfig, ...config };

  // Try init with provided base URL; if it fails (404s or network), try without '/auth' suffix.
  async function tryInit(baseUrl: string) {
    keycloak = new Keycloak({ url: baseUrl, realm: cfg.realm, clientId: cfg.clientId });
    return await keycloak.init({
      // disable automatic check-sso to avoid silent SSO redirects that can cause login_required loops
      // the app will rely on the Login button to start interactive auth
      onLoad: 'none',
      pkceMethod: 'S256',
      // disabled silentCheckSsoRedirectUri to avoid iframe-based silent SSO loops
      // (browsers may block third-party cookies or storage causing login_required errors).
      checkLoginIframe: false,
    });
  }

  // If the URL fragment contains an OIDC error (e.g. error=login_required)
  // clear it to avoid repeated failed login callbacks that cause loops.
  if (window.location && window.location.hash && window.location.hash.includes('error=')) {
    console.warn('[KeycloakService] detected OIDC error in URL fragment, clearing hash to avoid loops:', window.location.hash);
    try {
      // remove fragment without reloading
      const url = window.location.href.replace(window.location.hash, '');
      window.history.replaceState({}, document.title, url);
    } catch (e) {
      // ignore
    }
  }

  let inited = false;
  try {
    inited = await tryInit(cfg.url);
  } catch (e) {
    // fallback: if url ends with '/auth', try without it
    const altUrl = cfg.url.replace(/\/auth\/?$/, '');
    if (altUrl !== cfg.url) {
      try {
        console.info('[KeycloakService] primary URL failed, trying alt URL:', altUrl);
        inited = await tryInit(altUrl);
        // update window debug info
        cfg.url = altUrl;
      } catch (e2) {
        console.warn('[KeycloakService] both Keycloak init attempts failed');
        throw e2;
      }
    } else {
      throw e;
    }
  }

  // attach event handlers for diagnostics and to avoid loops
  if (keycloak) {
    keycloak.onAuthSuccess = () => console.info('[KeycloakService] onAuthSuccess');
    keycloak.onAuthError = (err) => console.error('[KeycloakService] onAuthError', err);
    keycloak.onAuthRefreshError = () => console.error('[KeycloakService] onAuthRefreshError');
    keycloak.onAuthRefreshSuccess = () => console.info('[KeycloakService] onAuthRefreshSuccess');
    keycloak.onAuthLogout = () => console.info('[KeycloakService] onAuthLogout');
    keycloak.onTokenExpired = () => {
      console.warn('[KeycloakService] token expired');
      // try refreshing token but avoid immediate login redirect loops
      try {
        keycloak.updateToken(10).catch(() => {
          console.warn('[KeycloakService] updateToken failed after expiry');
        });
      } catch (e) {}
    };
    // expose for debug in browser console
    try {
      // @ts-ignore
      (window as any).__KEYCLOAK__ = keycloak;
    } catch (e) {}
  }

  // expose a minimal global for remotes
  (window as any).RMU_AUTH = {
    token: keycloak.token,
    isAuthenticated: keycloak.authenticated,
    login: () => login(),
    logout: (options?: any) => logout(options),
    profile: null,
  };

  if (inited && keycloak.authenticated) {
    try {
      const profile = await keycloak.loadUserProfile();
      (window as any).RMU_AUTH.profile = profile;
    } catch (e) {
      // ignore
    }
  }

  // auto refresh token
  setInterval(
    () => {
      if (!keycloak) return;
      keycloak.updateToken(REFRESH_INTERVAL).then((refreshed) => {
        (window as any).RMU_AUTH.token = keycloak?.token;
        (window as any).RMU_AUTH.isAuthenticated = keycloak?.authenticated;
      });
    },
    (REFRESH_INTERVAL - 5) * 1000
  );

  console.info(
    '[KeycloakService] init finished, inited=%o, authenticated=%o, baseUrl=%s, clientId=%s',
    inited,
    keycloak?.authenticated,
    cfg.url,
    cfg.clientId
  );

  return keycloak;
}

export function getKeycloak() {
  return keycloak;
}

export function getToken(): string | undefined {
  return keycloak?.token;
}

export function login() {
  if (!keycloak) return;
  console.info('[KeycloakService] initiating login with pkceMethod=S256');
  try {
    // @ts-ignore - keycloak-js types may not include pkceMethod on login options
    return keycloak.login({ pkceMethod: 'S256' });
  } catch (e) {
    console.warn('[KeycloakService] login call failed, falling back to default login()', e);
    return keycloak.login();
  }
}

export function logout(options?: any) {
  return keycloak?.logout(options);
}

export function isAuthenticated() {
  return !!keycloak?.authenticated;
}

export async function getProfile() {
  if (!keycloak) return null;
  try {
    return await keycloak.loadUserProfile();
  } catch (e) {
    return null;
  }
}

export default {
  initKeycloak,
  getKeycloak,
  getToken,
  login,
  logout,
  isAuthenticated,
  getProfile,
};
