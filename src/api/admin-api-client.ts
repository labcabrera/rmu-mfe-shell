import { AuthContextProps } from 'react-oidc-context';

/** One month of creations, `YYYY-MM` in UTC. */
export type MonthCount = { month: string; count: number };

/** GET /v1/stats of an API (spec 053): total, by status when it has one, and creations of the last 12 months. */
export type CollectionStats = { total: number; byStatus?: Record<string, number>; createdByMonth: MonthCount[] };

export type StrategicStats = { campaigns: CollectionStats; characters: CollectionStats; factions: CollectionStats };
export type TacticalStats = { games: CollectionStats };
export type UsersApiStats = {
  users: CollectionStats & { active: number; newThisMonth: number };
  activationCodes: { total: number; free: number; used: number; expired: number };
};
export type MediaStats = { images: CollectionStats & { sizeBytes: number } };

/** GET /v1/info of an API. */
export type ApiInfo = { name: string; version: string; uptimeSeconds: number };

/** The NestJS APIs with health and info, by the base URI the shell has for each one (`/api/<name>/v1`). */
export const SYSTEM_APIS = [
  { name: 'core', uri: process.env.RMU_API_CORE_URI },
  { name: 'strategic', uri: process.env.RMU_API_STRATEGIC_URI },
  { name: 'tactical', uri: process.env.RMU_API_TACTICAL_URI },
  { name: 'attack-tables', uri: process.env.RMU_API_ATTACK_TABLES_URI },
  { name: 'items', uri: process.env.RMU_API_ITEMS_URI },
  { name: 'spells', uri: process.env.RMU_API_SPELLS_URI },
  { name: 'users', uri: process.env.RMU_API_USERS_URI },
  { name: 'media', uri: process.env.RMU_API_MEDIA_URI },
].filter((api): api is { name: string; uri: string } => Boolean(api.uri));

/** Operation tools of the environment; only those with their variable set are offered (production leaves them empty). */
export const ADMIN_TOOLS = [
  { key: 'keycloak', uri: process.env.RMU_ADMIN_KEYCLOAK_URI },
  { key: 'kafka-ui', uri: process.env.RMU_ADMIN_KAFKA_UI_URI },
  { key: 'grafana', uri: process.env.RMU_ADMIN_GRAFANA_URI },
  { key: 'mongo-express', uri: process.env.RMU_ADMIN_MONGO_EXPRESS_URI },
].filter((tool): tool is { key: string; uri: string } => Boolean(tool.uri));

const apiUri = (name: string) => SYSTEM_APIS.find((api) => api.name === name)?.uri;

async function getJson<T>(url: string, auth?: AuthContextProps): Promise<T> {
  const response = await fetch(url, { headers: auth ? { Authorization: `Bearer ${auth.user?.access_token}` } : {} });
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  return (await response.json()) as T;
}

export const adminApiClient = {
  /** Statistics of strategic, tactical, users or media (administrators only). */
  fetchStats<T>(api: 'strategic' | 'tactical' | 'users' | 'media', auth: AuthContextProps): Promise<T> {
    const uri = apiUri(api);
    return uri ? getJson<T>(`${uri}/stats`, auth) : Promise.reject(new Error(`No URI for ${api}`));
  },

  /** Whether the health check of an API answers 200 (it is public). */
  async isHealthy(uri: string): Promise<boolean> {
    try {
      return (await fetch(`${uri}/health`)).ok;
    } catch {
      return false;
    }
  },

  fetchInfo(uri: string, auth: AuthContextProps): Promise<ApiInfo> {
    return getJson<ApiInfo>(`${uri}/info`, auth);
  },
};
