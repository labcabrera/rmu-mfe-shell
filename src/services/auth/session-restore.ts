import React from 'react';
import { useAuth } from 'react-oidc-context';

/** True while the shell runs its startup silent sign-in (see AuthProvider). */
export const SessionRestoreContext = React.createContext<boolean>(false);

/**
 * True while the authentication state is not settled yet: the OIDC library is loading the stored
 * user or handling a callback, a navigator (redirect, iframe) is active, or the startup silent
 * sign-in is still running. Show a loading state instead of "Sign in" while it is true.
 */
export const useAuthPending = (): boolean => {
  const auth = useAuth();
  const restoring = React.useContext(SessionRestoreContext);
  return auth.isLoading || !!auth.activeNavigator || (restoring && !auth.isAuthenticated);
};
