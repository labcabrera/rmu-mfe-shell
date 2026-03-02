import Keycloak, { KeycloakInstance } from 'keycloak-js';

let keycloak: KeycloakInstance | null = null;

const REFRESH_INTERVAL = 20; // seconds to try refresh before expiring

const STORAGE_TOKEN_KEY = 'rmu.token';
const STORAGE_PROFILE_KEY = 'rmu.profile';

export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

const defaultConfig: KeycloakConfig = {
  url: process.env.KC_URL as string,
  realm: process.env.KC_REALM as string,
  clientId: process.env.KC_CLIENT_ID as string,
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
    keycloak.onAuthSuccess = async () => {
      console.info('[KeycloakService] onAuthSuccess');
      try {
        sessionStorage.setItem(STORAGE_TOKEN_KEY, keycloak?.token ?? '');
        const profile = await keycloak?.loadUserProfile();
        if (profile) sessionStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
      } catch (e) {}
    };
    keycloak.onAuthError = (err) => console.error('[KeycloakService] onAuthError', err);
    keycloak.onAuthRefreshError = () => console.error('[KeycloakService] onAuthRefreshError');
    keycloak.onAuthRefreshSuccess = () => {
      console.info('[KeycloakService] onAuthRefreshSuccess');
      try {
        sessionStorage.setItem(STORAGE_TOKEN_KEY, keycloak?.token ?? '');
      } catch (e) {}
    };
    keycloak.onAuthLogout = () => {
      console.info('[KeycloakService] onAuthLogout');
      try {
        sessionStorage.removeItem(STORAGE_TOKEN_KEY);
        sessionStorage.removeItem(STORAGE_PROFILE_KEY);
      } catch (e) {}
    };
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
      (window as any).__KEYCLOAK__ = keycloak;
    } catch (ignore) {}
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
      try {
        sessionStorage.setItem(STORAGE_TOKEN_KEY, keycloak.token ?? '');
        sessionStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
      } catch (e) {}
    } catch (e) {
      // ignore
    }
  }

  // If Keycloak failed to initialize but we have a stored token/profile, adopt them
  // to keep the UI authenticated across reloads without triggering silent SSO.
  if ((!keycloak || !keycloak.authenticated) && typeof sessionStorage !== 'undefined') {
    const storedToken = sessionStorage.getItem(STORAGE_TOKEN_KEY);
    const storedProfile = sessionStorage.getItem(STORAGE_PROFILE_KEY);
    if (storedToken) {
      try {
        keycloak = new Keycloak({ url: cfg.url, realm: cfg.realm, clientId: cfg.clientId });
        keycloak.token = storedToken;
        keycloak.authenticated = true;
        (window as any).RMU_AUTH = {
          token: storedToken,
          isAuthenticated: true,
          login: () => login(),
          logout: (options?: any) => logout(options),
          profile: storedProfile ? JSON.parse(storedProfile) : null,
        };
        console.info('[KeycloakService] adopted session from sessionStorage');
      } catch (e) {
        // ignore adoption errors
      }
    }
  }

  // auto refresh token
  setInterval(
    () => {
      if (!keycloak) return;
      keycloak.updateToken(REFRESH_INTERVAL).then(() => {
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

/**
 * Attempt a silent SSO check using a temporary Keycloak instance.
 * If a session exists, adopt the authenticated instance as the main keycloak.
 */
export async function silentCheckForSession(timeoutMs = 5000): Promise<boolean> {
  const cfg = defaultConfig;
  const tmp = new Keycloak({ url: cfg.url, realm: cfg.realm, clientId: cfg.clientId });
  let timer: any;
  try {
    const p = tmp.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      checkLoginIframe: false,
    });
    const res = await Promise.race([
      p,
      new Promise((_, rej) => {
        timer = setTimeout(() => rej(new Error('silent-check-timeout')), timeoutMs);
      }),
    ]);
    clearTimeout(timer);
    if (res && tmp.authenticated) {
      // adopt tmp as main instance
      keycloak = tmp;
      // update RMU_AUTH
      (window as any).RMU_AUTH = {
        token: keycloak.token,
        isAuthenticated: keycloak.authenticated,
        login: () => login(),
        logout: (options?: any) => logout(options),
        profile: null,
      };
      try {
        const profile = await keycloak.loadUserProfile();
        (window as any).RMU_AUTH.profile = profile;
      } catch (e) {}
      console.info('[KeycloakService] silent SSO found session and adopted it');
      return true;
    }
    return false;
  } catch (e) {
    clearTimeout(timer);
    console.info('[KeycloakService] silent SSO check failed or timed out', e);
    try {
      if (tmp && tmp.clear) tmp.clear();
    } catch (err) {}
    return false;
  }
}

export function getKeycloak() {
  return keycloak;
}

export function getToken(): string | undefined {
  if (keycloak?.token) return keycloak.token;
  try {
    const t = sessionStorage.getItem(STORAGE_TOKEN_KEY);
    return t ?? undefined;
  } catch (e) {
    return undefined;
  }
}

export function login() {
  if (!keycloak) return;
  console.info('[KeycloakService] initiating login with pkceMethod=S256');
  try {
    return keycloak.login({ pkceMethod: 'S256' });
  } catch (e) {
    console.warn('[KeycloakService] login call failed, falling back to default login()', e);
    return keycloak.login();
  }
}

export function logout(options?: any) {
  try {
    sessionStorage.removeItem(STORAGE_TOKEN_KEY);
    sessionStorage.removeItem(STORAGE_PROFILE_KEY);
  } catch (e) {}
  try {
    sessionStorage.setItem('rmu.logging_out', '1');
  } catch (e) {}
  return keycloak?.logout(options);
}

export function isAuthenticated() {
  if (keycloak?.authenticated) return true;
  try {
    return !!sessionStorage.getItem(STORAGE_TOKEN_KEY);
  } catch (e) {
    return false;
  }
}

export async function getProfile() {
  if (keycloak) {
    try {
      return await keycloak.loadUserProfile();
    } catch (e) {
      return null;
    }
  }
  // If no Keycloak instance, fall back to sessionStorage-stored profile
  try {
    const stored = sessionStorage.getItem(STORAGE_PROFILE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return null;
}

// Synchronous read of stored profile from sessionStorage (fast path for UI hydration)
export function getStoredProfile(): any | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_PROFILE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return null;
}

/**
 * Fetch the Keycloak account endpoint using the stored token.
 * Returns parsed JSON on 2xx, otherwise throws an error with `status`.
 */
export async function fetchAccount(): Promise<any> {
  const token = getToken();
  if (!token) throw Object.assign(new Error('no-token'), { status: 401 });
  const url = `${defaultConfig.url.replace(/\/$/, '')}/realms/${defaultConfig.realm}/account`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    credentials: 'omit',
  });
  if (!res.ok) {
    const err: any = new Error('account-fetch-failed');
    err.status = res.status;
    try {
      err.body = await res.text();
    } catch (ignore) {}
    throw err;
  }
  return await res.json();
}

export default {
  initKeycloak,
  silentCheckForSession,
  getKeycloak,
  getToken,
  login,
  logout,
  isAuthenticated,
  getProfile,
  getStoredProfile,
};
