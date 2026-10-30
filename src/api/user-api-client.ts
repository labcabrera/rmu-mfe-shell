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
};

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

export const userApiClient = {
  /** Every user, as an admin sees them (GET /users is admin only). */
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
