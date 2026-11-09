import { AuthContextProps } from 'react-oidc-context';
import { callApi, isApiError } from '@labcabrera-rmu/rmu-react-shared-lib';
import { userApiBaseUrl } from '../services/config';

export type Page<T> = {
  content: T[];
  pagination: Pagination;
};

// Same shape as rmu-api-users' Page: { content, pagination: { page, size, totalElements, totalPages } }.
type Pagination = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type MeasurementSystem = 'metric' | 'imperial';

type UserSettings = {
  measurementSystem: MeasurementSystem;
};

type IdentityProvider = 'local' | 'google';

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

/** An invite link of rmu-api-users (spec 070): single use, 7 days. The token only comes in the creation answer. */
export type FriendInvite = {
  id: string;
  inviterId: string;
  inviterName: string;
  createdAt: string;
  expiresAt: string;
  token?: string;
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

const friendshipsPath = (rsql: string) => `/friendships?q=${encodeURIComponent(rsql)}`;

/** What to show of a failure: the API's own message when it sent one. */
export const apiErrorText = (err: unknown): string => {
  if (isApiError(err)) return err.detail || err.statusText;
  return err instanceof Error ? err.message : String(err);
};

/** A JSON call of rmu-api-users, through the client every MFE uses (session renewal included). */
const request = <T>(auth: AuthContextProps, method: string, path: string, body?: unknown): Promise<T> =>
  callApi(auth, `${userApiBaseUrl}${path}`, {
    method,
    ...(body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  }) as Promise<T>;

export const userApiClient = {
  /** Every user, as an admin sees them (GET /users is admin only). */
  /** One user by id (admin only). */
  async fetchUserById(id: string, auth: AuthContextProps): Promise<ApiUser> {
    return request(auth, 'GET', `/users/${encodeURIComponent(id)}`);
  },

  /** Sets the managed realm groups of a user (admin only). */
  async updateUserGroups(id: string, groups: string[], auth: AuthContextProps): Promise<ApiUser> {
    return request(auth, 'PUT', `/users/${encodeURIComponent(id)}/groups`, { groups });
  },

  /** Enables or disables an account (admin only). */
  async setUserEnabled(id: string, enabled: boolean, auth: AuthContextProps): Promise<ApiUser> {
    return request(auth, 'PATCH', `/users/${encodeURIComponent(id)}`, { enabled });
  },

  async fetchActivationCodes(rsql: string, page: number, size: number, auth: AuthContextProps): Promise<Page<ActivationCode>> {
    return request(auth, 'GET', `/activation-codes?q=${encodeURIComponent(rsql)}&page=${page}&size=${size}`);
  },

  async createActivationCodes(input: CreateActivationCodesInput, auth: AuthContextProps): Promise<ActivationCode[]> {
    return request(auth, 'POST', '/activation-codes', input);
  },

  async updateActivationCode(id: string, input: UpdateActivationCodeInput, auth: AuthContextProps): Promise<ActivationCode> {
    return request(auth, 'PATCH', `/activation-codes/${encodeURIComponent(id)}`, input);
  },

  async deleteActivationCode(id: string, auth: AuthContextProps): Promise<void> {
    return request(auth, 'DELETE', `/activation-codes/${encodeURIComponent(id)}`);
  },

  async fetchUsers(rsql: string, page: number, size: number, auth: AuthContextProps): Promise<Page<ApiUser>> {
    return request(auth, 'GET', `/users?q=${encodeURIComponent(rsql)}&page=${page}&size=${size}`);
  },

  async fetchUser(auth: AuthContextProps): Promise<ApiUser> {
    return request(auth, 'GET', '/users/me');
  },

  async updateCurrentUser(input: UpdateCurrentUserInput, auth: AuthContextProps): Promise<ApiUser> {
    return request(auth, 'PATCH', '/users/me', input);
  },

  async fetchFriends(auth: AuthContextProps): Promise<Page<Friendship>> {
    const userId = auth.user?.profile.sub;
    return request(auth, 'GET', friendshipsPath(`(requesterId==${userId},addresseeId==${userId});status==accepted`));
  },

  async fecthInvitationsPending(auth: AuthContextProps): Promise<Page<Friendship>> {
    return request(auth, 'GET', friendshipsPath(`addresseeId==${auth.user?.profile.sub};status==pending`));
  },

  async fecthInvitationsSent(auth: AuthContextProps): Promise<Page<Friendship>> {
    return request(auth, 'GET', friendshipsPath(`requesterId==${auth.user?.profile.sub};status==pending`));
  },

  async fetchActivateCode(code: string, auth: AuthContextProps): Promise<ActivationCode> {
    return request(auth, 'POST', '/activation-codes/check', { code });
  },

  async activateCode(code: string, auth: AuthContextProps): Promise<void> {
    return request(auth, 'POST', '/activation-codes/activate', { code });
  },

  async sendFriendRequest(addresseeName: string, message: string, auth: AuthContextProps): Promise<Friendship> {
    return request(auth, 'POST', '/friendships', { addresseeName, message });
  },

  /** Creates an invite link: the answer is the only time its token is seen (spec 070). */
  async createFriendInvite(auth: AuthContextProps): Promise<FriendInvite> {
    return request(auth, 'POST', '/friend-invites');
  },

  /** The active invites of the user, newest first, without tokens. */
  async fetchFriendInvites(auth: AuthContextProps): Promise<FriendInvite[]> {
    return request(auth, 'GET', '/friend-invites');
  },

  async deleteFriendInvite(id: string, auth: AuthContextProps): Promise<void> {
    return request(auth, 'DELETE', `/friend-invites/${encodeURIComponent(id)}`);
  },

  /** Who invites with a token. The token goes in the body, out of the access logs. */
  async checkFriendInvite(token: string, auth: AuthContextProps): Promise<FriendInvite> {
    return request(auth, 'POST', '/friend-invites/check', { token });
  },

  /** Accepts an invite: the inviter and the user become friends. */
  async acceptFriendInvite(token: string, auth: AuthContextProps): Promise<Friendship> {
    return request(auth, 'POST', '/friend-invites/accept', { token });
  },

  async updateFriendRequest(friendshipId: string, status: FriendshipStatus, auth: AuthContextProps): Promise<void> {
    return request(auth, 'PATCH', `/friendships/${friendshipId}`, { status });
  },

  async fetchBlockedUsers(auth: AuthContextProps): Promise<Page<Friendship>> {
    // Only the blocks this user made: the blocked participant neither sees nor undoes them (spec 044, decision 9).
    return request(auth, 'GET', friendshipsPath(`blockedBy==${auth.user?.profile.sub};status==blocked`));
  },

  async removeFriend(friendshipId: string, auth: AuthContextProps): Promise<void> {
    return request(auth, 'DELETE', `/friendships/${friendshipId}`);
  },
};
