import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import type { ApiUser, UpdateCurrentUserInput } from '../../api/user-api-client';
import { userApiClient } from '../../api/user-api-client';

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
      const response = await userApiClient.fetchUser(auth);
      setApiUser(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load user';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth.isAuthenticated, auth.user?.access_token]);

  const updateApiUser = useCallback(
    async (input: UpdateCurrentUserInput) => {
      const response = await userApiClient.updateCurrentUser(input, auth);
      setApiUser(response);
      setError(undefined);
      return response;
    },
    [auth.user?.access_token]
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
