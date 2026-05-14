import { AuthContextProps } from 'react-oidc-context';
import { userApiBaseUrl } from '../services/config';

export type ApiUser = {
  id: string;
  name: string;
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
      const json = await response.json();
      return json as ApiUser;
    }
    throw new ApiError(`Failed to fetch user: ${response.statusText}`, response.status);
  },

  async activateCode(auth: AuthContextProps, code: string): Promise<void> {
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
