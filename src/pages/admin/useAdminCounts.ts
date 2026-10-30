import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { AuthContextProps } from 'react-oidc-context';
import { fetchCharacters, fetchStrategicGames, fetchTacticalGames } from '@labcabrera-rmu/rmu-react-shared-lib';
import { userApiClient } from '../../api/user-api-client';

type Counter = (rsql: string, auth: AuthContextProps) => Promise<number>;

const total =
  (fetcher: (rsql: string, page: number, size: number, auth: AuthContextProps) => Promise<{ pagination: { totalElements: number } }>): Counter =>
  async (rsql, auth) =>
    (await fetcher(rsql, 0, 1, auth)).pagination.totalElements;

/** How many entities of each kind match a filter: one request of one element each, read from the page total. */
export const COUNTERS = {
  users: total((rsql, page, size, auth) => userApiClient.fetchUsers(rsql, page, size, auth)),
  campaigns: total(fetchStrategicGames),
  tactical: total(fetchTacticalGames),
  characters: total(fetchCharacters),
};

export type CountQuery = { key: string; counter: keyof typeof COUNTERS; rsql: string };

/** The counts of the dashboard, by `key`; a failed one stays undefined (its API may be down). */
export const useAdminCounts = (queries: CountQuery[]) => {
  const auth = useAuth();
  const [counts, setCounts] = useState<Record<string, number | undefined>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all(
      queries.map((query) =>
        COUNTERS[query.counter](query.rsql, auth)
          .then((count) => [query.key, count] as const)
          .catch(() => [query.key, undefined] as const)
      )
    ).then((entries) => {
      if (!active) return;
      setCounts(Object.fromEntries(entries));
      setLoading(false);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { counts, loading };
};
