import type { TFunction } from 'i18next';
import { ApiError } from '../../api/user-api-client';

/** Error codes of the friendships and invites of rmu-api-users with a translation `error-<code>` (spec 070). */
const FRIEND_ERROR_CODES = new Set([
  'addressee-not-found',
  'friendship-self',
  'friendship-pending',
  'already-friends',
  'friendship-blocked',
  'friend-request-limit',
  'friend-invite-limit',
  'friend-invite-invalid',
  'friend-invite-self',
]);

/** The translated message of a friendship error, or the API's own message for any other. */
export function friendErrorMessage(err: unknown, t: TFunction): string {
  if (err instanceof ApiError && err.code && FRIEND_ERROR_CODES.has(err.code)) return t(`error-${err.code}`);
  return err instanceof Error ? err.message : String(err);
}
