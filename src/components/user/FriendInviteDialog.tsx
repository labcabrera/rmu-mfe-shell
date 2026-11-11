import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import AddLinkIcon from '@mui/icons-material/AddLink';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, Button, IconButton, InputAdornment, List, ListItem, ListItemText, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { EmptyState, LoadingState, RmuDialog } from '@labcabrera-rmu/rmu-react-shared-lib';
import type { FriendInvite } from '../../api/user-api-client';
import { userApiClient } from '../../api/user-api-client';
import { friendErrorMessage } from './friend-errors';

/** The page that opens an invite: `/friends/invite/<token>` of this same shell. */
const friendInviteUrl = (token: string): string => `${window.location.origin}/friends/invite/${encodeURIComponent(token)}`;

/**
 * Invite links (spec 070): creates one and shows it once to copy it, and lists the active ones to delete them. The
 * link works once and for 7 days.
 */
export default function FriendInviteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const auth = useAuth();
  const { t, i18n } = useTranslation();
  const [invites, setInvites] = useState<FriendInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string>();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>();

  const load = () => {
    setLoading(true);
    userApiClient
      .fetchFriendInvites(auth)
      .then(setInvites)
      .catch((err) => setError(friendErrorMessage(err, t)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!open) return;
    setLink(undefined);
    setCopied(false);
    setError(undefined);
    load();
  }, [open]);

  const create = () => {
    setError(undefined);
    userApiClient
      .createFriendInvite(auth)
      .then((invite) => {
        setLink(invite.token ? friendInviteUrl(invite.token) : undefined);
        setCopied(false);
        load();
      })
      .catch((err) => setError(friendErrorMessage(err, t)));
  };

  const copy = () => {
    if (!link) return;
    navigator.clipboard
      ?.writeText(link)
      .then(() => setCopied(true))
      .catch((err) => setError(friendErrorMessage(err, t)));
  };

  const remove = (id: string) => {
    setError(undefined);
    userApiClient
      .deleteFriendInvite(id, auth)
      .then(() => {
        setLink(undefined);
        load();
      })
      .catch((err) => setError(friendErrorMessage(err, t)));
  };

  const date = (value: string) => new Date(value).toLocaleDateString(i18n.language);

  return (
    <RmuDialog open={open} onClose={onClose} title={t('friend-invite-links')} maxWidth="sm">
      <Stack spacing={2}>
        <Typography color="text.secondary">{t('friend-invite-help')}</Typography>
        <Button variant="contained" startIcon={<AddLinkIcon />} onClick={create} sx={{ alignSelf: 'flex-start' }}>
          {t('friend-invite-create')}
        </Button>
        {link && (
          <TextField
            label={t('friend-invite-link')}
            value={link}
            helperText={copied ? t('friend-invite-copied') : t('friend-invite-once')}
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={t('friend-invite-copy')}>
                      <IconButton aria-label={t('friend-invite-copy')} onClick={copy} edge="end">
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
        {error && <Alert severity="error">{error}</Alert>}
        <Typography variant="subtitle2">{t('friend-invite-active')}</Typography>
        {loading ? (
          <LoadingState />
        ) : invites.length === 0 ? (
          <EmptyState dense title={t('friend-invite-none')} />
        ) : (
          <List disablePadding>
            {invites.map((invite) => (
              <ListItem
                key={invite.id}
                divider
                secondaryAction={
                  <Tooltip title={t('friend-invite-delete')}>
                    <IconButton color="error" aria-label={t('friend-invite-delete')} onClick={() => remove(invite.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemText
                  primary={t('friend-invite-created', { date: date(invite.createdAt) })}
                  secondary={t('friend-invite-expires', { date: date(invite.expiresAt) })}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
    </RmuDialog>
  );
}
