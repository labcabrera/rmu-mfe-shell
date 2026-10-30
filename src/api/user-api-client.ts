import { AuthContextProps } from 'react-oidc-context';
import { userApiBaseUrl } from '../services/config';

export type Page<T> = {
  content: T[];
  pagination: Pagination;
};

// Same shape as rmu-api-users' Page: { content, pagination: { page, size, totalElements, totalPages } }.
export type Pagination = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type MeasurementSystem = 'metric' | 'imperial';

export type UserSettings = {
  measurementSystem: MeasurementSystem;
};

export type IdentityProvider = 'local' | 'google';

export type ApiUser = {
  id: string;
  name: string;
  email?: string;
  emailVerified?: boolean;
  enabled?: boolean;
  features?: string[];
  settings?: UserSettings;
  imageUrl?: string | null;
  identityProvider?: IdentityProvider | string;
  lastLoginAt?: string | null;
  createdAt?: Date;
  updatedAt?: Date | null;
};

/** Public projection returned by GET /users/search, used for friend search. */
export type UserSummary = {
  id: string;
  name: string;
  imageUrl?: string | null;
};

export type UpdateCurrentUserInput = {
  name?: string;
  settings?: Partial<UserSettings>;
  imageUrl?: string | null;
};

export type ActivationCode = {
  id: string;
  code: string;
  features: string[];
  owner?: string;
  createdAt?: string;
  expiresAt?: string | null;
  activatedAt?: string | null;
  activatedBy?: string | null;
  note?: string | null;
  version?: number;
};

export const ACTIVATION_FEATURES = ['core-law', 'spell-law', 'treasure-law', 'creature-law-i'] as const;

/** Realm groups an administrator can grant (the API's MANAGED_GROUPS). */
export const MANAGED_GROUPS = ['rmu-user', 'rmu-admin', 'rmu-core-law', 'rmu-spell-law', 'rmu-treasure-law', 'rmu-creature-law-i'] as const;

/** First line of the CSV of new codes. */
export const ACTIVATION_CODES_CSV_HEADER = 'code;features;expiresAt;note';

export type CreateActivationCodesInput = { features: string[]; count: number; expiresAt?: string; note?: string };
export type UpdateActivationCodeInput = { expiresAt?: string; note?: string | null; activatedAt?: null; version?: number };

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

export type Friendship = {
  id: string;
  requesterId: string;
  requesterName: string;
  addresseeId: string;
  addresseeName: string;
  status: FriendshipStatus;
  /** Participant that blocked the friendship (spec 044): only that user can unblock it. Null unless blocked. */
  blockedBy?: string | null;
  message: string;
  createdAt: Date;
  updatedAt: Date;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

const friendshipsUrl = (rsql: string) => `${userApiBaseUrl}/friendships?q=${encodeURIComponent(rsql)}`;

/** A call of the administration: JSON in and out, and the API's message in the error. */
async function adminRequest<T>(auth: AuthContextProps, method: string, path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${userApiBaseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${auth.user?.access_token}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => ({}));
  if (response.ok) return data as T;
  throw new ApiError((data as { message?: string }).message || response.statusText, response.status);
}

export const userApiClient = {
  /** Every user, as an admin sees them (GET /users is admin only). */
  /** One user by id (admin only). */
  async fetchUserById(id: string, auth: AuthContextProps): Promise<ApiUser> {
    return adminRequest(auth, 'GET', `/users/${encodeURIComponent(id)}`);
  },

  /** Sets the managed realm groups of a user (admin only). */
  async updateUserGroups(id: string, groups: string[], auth: AuthContextProps): Promise<ApiUser> {
    return adminRequest(auth, 'PUT', `/users/${encodeURIComponent(id)}/groups`, { groups });
  },

  /** Enables or disables an account (admin only). */
  async setUserEnabled(id: string, enabled: boolean, auth: AuthContextProps): Promise<ApiUser> {
    return adminRequest(auth, 'PATCH', `/users/${encodeURIComponent(id)}`, { enabled });
  },

  async fetchActivationCodes(rsql: string, page: number, size: number, auth: AuthContextProps): Promise<Page<ActivationCode>> {
    return adminRequest(auth, 'GET', `/activation-codes?q=${encodeURIComponent(rsql)}&page=${page}&size=${size}`);
  },

  async createActivationCodes(input: CreateActivationCodesInput, auth: AuthContextProps): Promise<ActivationCode[]> {
    return adminRequest(auth, 'POST', '/activation-codes', input);
  },

  async updateActivationCode(id: string, input: UpdateActivationCodeInput, auth: AuthContextProps): Promise<ActivationCode> {
    return adminRequest(auth, 'PATCH', `/activation-codes/${encodeURIComponent(id)}`, input);
  },

  async deleteActivationCode(id: string, auth: AuthContextProps): Promise<void> {
    return adminRequest(auth, 'DELETE', `/activation-codes/${encodeURIComponent(id)}`);
  },

  async fetchUsers(rsql: string, page: number, size: number, auth: AuthContextProps): Promise<Page<ApiUser>> {
    const response = await fetch(`${userApiBaseUrl}/users?q=${encodeURIComponent(rsql)}&page=${page}&size=${size}`, {
      headers: { Authorization: `Bearer ${auth.user?.access_token}` },
    });
    if (response.ok) return await response.json();
    throw new ApiError(`Failed to fetch users: ${response.statusText}`, response.status);
  },

  async fetchUser(auth: AuthContextProps): Promise<ApiUser> {
    const response = await fetch(`${userApiBaseUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${auth.user?.access_token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
    throw new ApiError(`Failed to fetch user: ${response.statusText}`, response.status);
  },

  async updateCurrentUser(input: UpdateCurrentUserInput, auth: AuthContextProps): Promise<ApiUser> {
    const response = await fetch(`${userApiBaseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user?.access_token}`,
      },
      body: JSON.stringify(input),
    });
    if (response.ok) {
      return await response.json();
    }
    const err = await response.json().catch(() => ({}));
    throw new ApiError((err as { message?: string }).message || `Failed to update user: ${response.statusText}`, response.status);
  },

  async fetchFriends(auth: AuthContextProps): Promise<Page<Friendship>> {
    const userId = auth.user?.profile.sub;
    const rsql = `(requesterId==${userId},addresseeId==${userId});status==accepted`;
    const response = await fetch(friendshipsUrl(rsql), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth.user?.access_token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
    const err = await response.json();
    throw new ApiError(err.message || `Failed to check activation code: ${response.statusText}`, response.status);
  },

  async fecthInvitationsPending(auth: AuthContextProps): Promise<Page<Friendship>> {
    const userId = auth.user?.profile.sub;
    const rsql = `addresseeId==${userId};status==pending`;
    //TODO page and size
    const response = await fetch(friendshipsUrl(rsql), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth.user?.access_token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
    const err = await response.json();
    throw new ApiError(err.message || `Failed to check activation code: ${response.statusText}`, response.status);
  },

  async fecthInvitationsSent(auth: AuthContextProps): Promise<Page<Friendship>> {
    const userId = auth.user?.profile.sub;
    const rsql = `requesterId==${userId};status==pending`;
    const response = await fetch(friendshipsUrl(rsql), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth.user?.access_token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
    const err = await response.json();
    throw new ApiError(err.message || `Failed to check activation code: ${response.statusText}`, response.status);
  },

  async searchUsers(name: string, auth: AuthContextProps, size = 10): Promise<Page<UserSummary>> {
    const params = new URLSearchParams({ name, size: String(size) });
    const response = await fetch(`${userApiBaseUrl}/users/search?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${auth.user?.access_token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
    throw new ApiError(`Failed to search users: ${response.statusText}`, response.status);
  },

  async fetchActivateCode(code: string, auth: AuthContextProps): Promise<ActivationCode> {
    const response = await fetch(`${userApiBaseUrl}/activation-codes/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user?.access_token}`,
      },
      body: JSON.stringify({ code }),
    });
    if (response.ok) {
      return await response.json();
    }
    const err = await response.json();
    throw new ApiError(err.message || `Failed to check activation code: ${response.statusText}`, response.status);
  },

  async activateCode(code: string, auth: AuthContextProps): Promise<void> {
    const response = await fetch(`${userApiBaseUrl}/activation-codes/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user?.access_token}`,
      },
      body: JSON.stringify({ code }),
    });
    if (!response.ok) {
      throw new ApiError(`Failed to activate code: ${response.statusText}`, response.status);
    }
  },

  async sendFriendRequest(addresseeName: string, message: string, auth: AuthContextProps): Promise<Friendship> {
    const response = await fetch(`${userApiBaseUrl}/friendships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user?.access_token}`,
      },
      body: JSON.stringify({ addresseeName, message }),
    });
    if (response.ok) {
      return await response.json();
    }
    const err = await response.json();
    throw new ApiError(err.message || `Failed to send friend request: ${response.statusText}`, response.status);
  },

  async updateFriendRequest(friendshipId: string, status: FriendshipStatus, auth: AuthContextProps): Promise<void> {
    const response = await fetch(`${userApiBaseUrl}/friendships/${friendshipId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user?.access_token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new ApiError((err as { message?: string }).message || `Failed to update friend request: ${response.statusText}`, response.status);
    }
  },

  async fetchBlockedUsers(auth: AuthContextProps): Promise<Page<Friendship>> {
    const userId = auth.user?.profile.sub;
    // Only the blocks this user made: the blocked participant neither sees nor undoes them (spec 044, decision 9).
    const rsql = `blockedBy==${userId};status==blocked`;
    const response = await fetch(friendshipsUrl(rsql), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth.user?.access_token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
    const err = await response.json();
    throw new ApiError(err.message || `Failed to fetch blocked users: ${response.statusText}`, response.status);
  },

  async removeFriend(friendshipId: string, auth: AuthContextProps): Promise<void> {
    const response = await fetch(`${userApiBaseUrl}/friendships/${friendshipId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.user?.access_token}`,
      },
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new ApiError((err as { message?: string }).message || `Failed to remove friendship: ${response.statusText}`, response.status);
    }
  },
};
