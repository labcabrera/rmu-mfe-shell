import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { adminApiClient, MediaStats, StrategicStats, TacticalStats, UsersApiStats } from '../../api/admin-api-client';

export type AdminStats = { strategic?: StrategicStats; tactical?: TacticalStats; users?: UsersApiStats; media?: MediaStats };

/** The statistics of the four APIs that have them; one that fails stays undefined (its API may be down or older). */
export const useAdminStats = () => {
  const auth = useAuth();
  const [stats, setStats] = useState<AdminStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const read = <T>(api: 'strategic' | 'tactical' | 'users' | 'media') => adminApiClient.fetchStats<T>(api, auth).catch(() => undefined);
    Promise.all([read<StrategicStats>('strategic'), read<TacticalStats>('tactical'), read<UsersApiStats>('users'), read<MediaStats>('media')]).then(
      ([strategic, tactical, users, media]) => {
        if (!active) return;
        setStats({ strategic, tactical, users, media });
        setLoading(false);
      }
    );
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { stats, loading };
};
