import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useNavigate, useParams } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Alert, Button, Stack } from '@mui/material';
import { LoadingState, MessageScreen } from '@labcabrera-rmu/rmu-react-shared-lib';
import type { FriendInvite } from '../api/user-api-client';
import { userApiClient } from '../api/user-api-client';
import { friendErrorMessage } from '../components/user/friend-errors';

/**
 * Opens an invite link (spec 070): who invites, and Accept or Ignore. The profile is loaded first, because GET /me
 * creates it on the first visit of a user that just signed up.
 */
const FriendInvitePage: React.FC = () => {
  const { token = '' } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [invite, setInvite] = useState<FriendInvite>();
  const [loadError, setLoadError] = useState<string>();
  const [acceptError, setAcceptError] = useState<string>();
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    userApiClient
      .fetchUser(auth)
      .then(() => userApiClient.checkFriendInvite(token, auth))
      .then(setInvite)
      .catch((err) => setLoadError(friendErrorMessage(err, t)));
  }, [token]);

  const toProfile = () => navigate('/user-profile');

  const accept = () => {
    setAccepting(true);
    setAcceptError(undefined);
    userApiClient
      .acceptFriendInvite(token, auth)
      .then(() => setAccepted(true))
      .catch((err) => setAcceptError(friendErrorMessage(err, t)))
      .finally(() => setAccepting(false));
  };

  if (loadError) {
    return (
      <MessageScreen
        title={t('friend-invite-invalid-title')}
        text={loadError}
        action={<Button onClick={toProfile}>{t('friend-invite-to-profile')}</Button>}
      />
    );
  }
  if (!invite) return <LoadingState />;

  if (accepted) {
    return (
      <MessageScreen
        icon={<CheckIcon color="success" fontSize="large" />}
        title={t('friend-invite-accepted', { name: invite.inviterName })}
        action={
          <Button variant="contained" onClick={toProfile}>
            {t('friend-invite-to-profile')}
          </Button>
        }
      />
    );
  }

  const own = invite.inviterId === auth.user?.profile.sub;
  return (
    <MessageScreen
      icon={<PersonAddIcon color="primary" fontSize="large" />}
      title={own ? t('friend-invite-own-title') : t('friend-invite-title', { name: invite.inviterName })}
      text={own ? t('error-friend-invite-self') : t('friend-invite-text')}
      action={
        <Stack spacing={2} sx={{ width: '100%' }}>
          {acceptError && <Alert severity="error">{acceptError}</Alert>}
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
            {!own && (
              <Button variant="contained" onClick={accept} disabled={accepting} startIcon={<CheckIcon />}>
                {t('accept-invitation')}
              </Button>
            )}
            <Button onClick={toProfile}>{own ? t('friend-invite-to-profile') : t('friend-invite-ignore')}</Button>
          </Stack>
        </Stack>
      }
    />
  );
};

export default FriendInvitePage;
