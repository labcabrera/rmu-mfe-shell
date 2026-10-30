import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import {
  Character,
  fetchCharacters,
  fetchStrategicGames,
  fetchTacticalGames,
  StrategicGame,
  TacticalGame,
} from '@labcabrera-rmu/rmu-react-shared-lib';

export type LandingData = {
  /** Signed in: the landing shows the user's table. */
  signedIn: boolean;
  loading: boolean;
  tacticalGames: TacticalGame[];
  strategicGames: StrategicGame[];
  characters: Character[];
  /** Totals, for the counters of the tiles. */
  counts: { tactical: number; strategic: number; characters: number };
};

const EMPTY = { tacticalGames: [], strategicGames: [], characters: [], counts: { tactical: 0, strategic: 0, characters: 0 } };

/**
 * What the user has on the table: games in progress, campaigns and characters. Only when signed in; a failing API
 * leaves its part empty instead of breaking the landing.
 */
export const useLandingData = (): LandingData => {
  const auth = useAuth();
  const [data, setData] = useState<Omit<LandingData, 'signedIn' | 'loading'>>(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setData(EMPTY);
      return;
    }
    setLoading(true);
    const settle = <T>(promise: Promise<{ content: T[]; pagination: { totalElements: number } }>) =>
      promise.catch(() => ({ content: [] as T[], pagination: { totalElements: 0 } }));
    Promise.all([
      settle(fetchTacticalGames('status==in_progress', 0, 4, auth)),
      settle(fetchStrategicGames('', 0, 4, auth)),
      settle(fetchCharacters('', 0, 6, auth)),
    ])
      .then(([tactical, strategic, characters]) =>
        setData({
          tacticalGames: tactical.content,
          strategicGames: strategic.content,
          characters: characters.content,
          counts: {
            tactical: tactical.pagination.totalElements,
            strategic: strategic.pagination.totalElements,
            characters: characters.pagination.totalElements,
          },
        })
      )
      .finally(() => setLoading(false));
  }, [auth.isAuthenticated]);

  return { ...data, signedIn: !!auth.isAuthenticated, loading };
};
