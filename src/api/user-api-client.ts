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

export type ApiUser = {
  id: string;
  name: string;
};

export type ActivationCode = {
  id: string;
  code: string;
  features: string[];
};

export type Friendship = {
  id: string;
  requesterId: string;
  addresseeName: string;
  status: string;
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

  async fetchFriends(auth: AuthContextProps): Promise<Page<Friendship>> {
    const userId = auth.user?.profile.sub;
    const rsql = `(requesterId==${userId},addresseeId==${userId});status==accepted)`;
    const response = await fetch(`${userApiBaseUrl}/activation-codes/friendships`, {
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
    const rsql = `(addresseeId==${userId});status==pending)`;
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
    const rsql = `(requesterId==${userId});status==pending)`;
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
};
