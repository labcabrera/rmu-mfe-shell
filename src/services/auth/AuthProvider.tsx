import React from 'react';
import { AuthProvider as OidcProvider, hasAuthParams, useAuth } from 'react-oidc-context';
import type { AuthProviderProps } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { oidcUrl, oidcRealm, oidcClientId } from '../config';
import { SessionRestoreContext } from './session-restore';

type Props = {
  children: React.ReactNode;
};

// Module scope, so React StrictMode's double effect run in development shares one attempt.
let silentSignIn: Promise<void> | undefined;

const silentLoginErrors = new Set(['login_required', 'interaction_required', 'consent_required', 'account_selection_required']);

const isExpectedSilentLoginError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { error?: unknown; message?: unknown };
  if (typeof candidate.error === 'string' && silentLoginErrors.has(candidate.error)) return true;
  if (typeof candidate.message !== 'string') return false;
  const message = candidate.message;
  return Array.from(silentLoginErrors).some((expectedError) => message.includes(expectedError));
};

const getPostLoginPath = (state: unknown): string => {
  if (!state || typeof state !== 'object' || !('returnTo' in state)) return '/';
  const returnTo = (state as { returnTo?: unknown }).returnTo;
  if (typeof returnTo !== 'string') return '/';
  return returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/';
};

/**
 * Runs one silent sign-in on startup when there is no user in sessionStorage (new tab, browser
 * restart). It uses the refresh token when there is one, or prompt=none against the Keycloak
 * session cookie ("Remember me"), so a live session enters without credentials.
 */
const SilentSignIn: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { isAuthenticated, isLoading, signinSilent } = useAuth();

  React.useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated || hasAuthParams()) {
      onDone();
      return;
    }
    if (!silentSignIn) {
      silentSignIn = signinSilent()
        .then(() => undefined)
        .catch((error) => {
          if (!isExpectedSilentLoginError(error)) {
            console.warn('[AuthProvider] Silent sign-in failed', error);
          }
        });
    }
    void silentSignIn.finally(onDone);
  }, [isAuthenticated, isLoading, onDone, signinSilent]);

  return null;
};

const AuthProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const oidcAuthority = `${oidcUrl.replace(/\/$/, '')}/realms/${oidcRealm}`;
  const appOrigin = window.location.origin;
  const [restoring, setRestoring] = React.useState(true);
  const restored = React.useCallback(() => setRestoring(false), []);

  const config: AuthProviderProps = {
    authority: oidcAuthority,
    client_id: oidcClientId,
    redirect_uri: `${appOrigin}/signin-callback`,
    post_logout_redirect_uri: `${appOrigin}/`,
    silent_redirect_uri: `${appOrigin}/silent-check-sso.html`,
    response_type: 'code',
    scope: 'openid profile email',
    automaticSilentRenew: true,
    loadUserInfo: true,
    onSigninCallback: (user) => {
      navigate(getPostLoginPath(user?.state), { replace: true });
    },
  };

  return (
    <OidcProvider {...config}>
      <SessionRestoreContext.Provider value={restoring}>
        <SilentSignIn onDone={restored} />
        {children}
      </SessionRestoreContext.Provider>
    </OidcProvider>
  );
};

export default AuthProvider;
