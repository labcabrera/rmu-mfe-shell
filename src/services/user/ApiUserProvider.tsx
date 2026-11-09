import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import type { ApiUser, UpdateCurrentUserInput } from '../../api/user-api-client';
import { userApiClient, apiErrorText } from '../../api/user-api-client';

type ApiUserContextValue = {
  apiUser?: ApiUser;
  loading: boolean;
  error?: string;
  refreshApiUser: () => Promise<ApiUser | undefined>;
  updateApiUser: (input: UpdateCurrentUserInput) => Promise<ApiUser>;
};

const ApiUserContext = createContext<ApiUserContextValue | undefined>(undefined);

export function ApiUserProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  // Workspace spec 091, E8: the user is read when the user changes, not on every renewal of the token.
  const authRef = useRef(auth);
  authRef.current = auth;
  const userId = auth.user?.profile.sub;
  const [apiUser, setApiUser] = useState<ApiUser>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const refreshApiUser = useCallback(async () => {
    if (!auth.isAuthenticated) {
      setApiUser(undefined);
      setError(undefined);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(undefined);
    try {
      const response = await userApiClient.fetchUser(authRef.current);
      setApiUser(response);
      return response;
    } catch (err) {
      setError(apiErrorText(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth.isAuthenticated, userId]);

  const updateApiUser = useCallback(
    async (input: UpdateCurrentUserInput) => {
      const response = await userApiClient.updateCurrentUser(input, authRef.current);
      setApiUser(response);
      setError(undefined);
      return response;
    },
    []
  );

  useEffect(() => {
    void refreshApiUser().catch((err) => console.error(err));
  }, [refreshApiUser]);

  const value = useMemo(
    () => ({
      apiUser,
      loading,
      error,
      refreshApiUser,
      updateApiUser,
    }),
    [apiUser, loading, error, refreshApiUser, updateApiUser]
  );

  return <ApiUserContext.Provider value={value}>{children}</ApiUserContext.Provider>;
}

export function useApiUser() {
  const context = useContext(ApiUserContext);
  if (!context) {
    throw new Error('useApiUser must be used within ApiUserProvider');
  }
  return context;
}
