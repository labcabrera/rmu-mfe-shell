import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { userApiClient } from '../../api/user-api-client';

/** Names already resolved, shared by every admin page while the app is open. */
const cache = new Map<string, string>();

/** Names of the users with the given ids (the `owner` of games and characters), resolved in one request. */
export const useUserNames = (ids: (string | undefined)[]): Record<string, string> => {
  const auth = useAuth();
  const [, setVersion] = useState(0);
  const key = [...new Set(ids.filter((id): id is string => !!id))].sort().join(',');

  useEffect(() => {
    const missing = key.split(',').filter((id) => id && !cache.has(id));
    if (missing.length === 0) return;
    userApiClient
      .fetchUsers(`id=in=(${missing.join(',')})`, 0, Math.min(missing.length, 100), auth)
      .then((page) => {
        page.content.forEach((user) => cache.set(user.id, user.name));
        // Ids without a user (deleted accounts) keep their id, so they are not asked again.
        missing.forEach((id) => !cache.has(id) && cache.set(id, id));
        setVersion((version) => version + 1);
      })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return Object.fromEntries(key.split(',').map((id) => [id, cache.get(id) ?? '…']));
};
