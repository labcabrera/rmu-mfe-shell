import { AuthContextProps } from 'react-oidc-context';
import { userApiBaseUrl } from '../services/config';

export type Page<T> = {
  content: T[];
  pagination: Pagination;
};

export type Pagination = {
  page: number;
  pageSize: number;
};

export type MeasurementSystem = 'metric' | 'imperial';

export type UserSettings = {
  measurementSystem: MeasurementSystem;
};

export type ApiUser = {
  id: string;
  name: string;
  email?: string;
  emailVerified?: boolean;
  enabled?: boolean;
  features?: string[];
  settings?: UserSettings;
  imageUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date | null;
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

export const userApiClient = {
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
    const response = await fetch(`${userApiBaseUrl}/friendships?q=${rsql}`, {
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
    const response = await fetch(`${userApiBaseUrl}/friendships?q=${rsql}`, {
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
    const response = await fetch(`${userApiBaseUrl}/friendships?q=${rsql}`, {
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
    const rsql = `requesterId==${userId};status==blocked`;
    const response = await fetch(`${userApiBaseUrl}/friendships?q=${rsql}`, {
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
