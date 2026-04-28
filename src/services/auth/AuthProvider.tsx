import React from 'react';
import { AuthProvider as OidcProvider } from 'react-oidc-context';
import type { AuthProviderProps } from 'react-oidc-context';
import { oidcUrl, oidcRealm, oidcClientId } from '../config';

type Props = {
  children: React.ReactNode;
};

const AuthProvider: React.FC<Props> = ({ children }) => {
  const OIDC_AUTHORITY = `${oidcUrl}/realms/${oidcRealm}`;

  const config: Partial<AuthProviderProps> = {
    authority: OIDC_AUTHORITY,
    client_id: oidcClientId,
    redirect_uri: window.location.origin + '/',
    response_type: 'code',
    scope: 'openid profile email',
    automaticSilentRenew: false,
    // silent_redirect_uri omitted to avoid iframe sandbox warnings; consider backend refresh for production
    loadUserInfo: true,
  };

  return <OidcProvider {...(config as AuthProviderProps)}>{children}</OidcProvider>;
};

export default AuthProvider;
