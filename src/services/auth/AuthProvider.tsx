import React from 'react';
import { AuthProvider as OidcProvider, hasAuthParams, useAuth } from 'react-oidc-context';
import type { AuthProviderProps } from 'react-oidc-context';
import { oidcUrl, oidcRealm, oidcClientId } from '../config';

type Props = {
  children: React.ReactNode;
};

let silentSignInAttempted = false;

const silentLoginErrors = new Set([
  'login_required',
  'interaction_required',
  'consent_required',
  'account_selection_required',
]);

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

const SilentSignIn: React.FC = () => {
  const { activeNavigator, isAuthenticated, isLoading, signinSilent } = useAuth();

  React.useEffect(() => {
    if (silentSignInAttempted || isLoading || isAuthenticated || activeNavigator || hasAuthParams()) {
      return;
    }

    silentSignInAttempted = true;
    void signinSilent().catch((error) => {
      if (!isExpectedSilentLoginError(error)) {
        console.warn('[AuthProvider] Silent sign-in failed', error);
      }
    });
  }, [activeNavigator, isAuthenticated, isLoading, signinSilent]);

  return null;
};

const AuthProvider: React.FC<Props> = ({ children }) => {
  const oidcAuthority = `${oidcUrl.replace(/\/$/, '')}/realms/${oidcRealm}`;
  const appOrigin = window.location.origin;

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
      window.history.replaceState({}, document.title, getPostLoginPath(user?.state));
    },
  };

  return (
    <OidcProvider {...config}>
      <SilentSignIn />
      {children}
    </OidcProvider>
  );
};

export default AuthProvider;
