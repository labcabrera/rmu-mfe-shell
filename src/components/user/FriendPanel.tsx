import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MailIcon from '@mui/icons-material/Mail';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from '@mui/material';
import { ConfirmDialog, EmptyState, LoadingState, RmuDialog, Section } from '@labcabrera-rmu/rmu-react-shared-lib';
import type { Friendship } from '../../api/user-api-client';
import { userApiClient } from '../../api/user-api-client';
import { friendErrorMessage } from './friend-errors';
import FriendInviteDialog from './FriendInviteDialog';

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function FriendPanel() {
  const auth = useAuth();
  const { t } = useTranslation();

  const [tab, setTab] = useState(0);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [pendingReceived, setPendingReceived] = useState<Friendship[]>([]);
  const [pendingSent, setPendingSent] = useState<Friendship[]>([]);
  const [blocked, setBlocked] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [addresseeName, setAddresseeName] = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [sendError, setSendError] = useState<string>();
  const [sending, setSending] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const [actionError, setActionError] = useState<string>();

  type ConfirmAction = 'remove-friend' | 'block-user';
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: ConfirmAction | null; friendship: Friendship | null }>({
    open: false,
    action: null,
    friendship: null,
  });

  const loadData = () => {
    setLoading(true);
    setError(undefined);
    setActionError(undefined);
    Promise.all([
      userApiClient.fetchFriends(auth),
      userApiClient.fecthInvitationsPending(auth),
      userApiClient.fecthInvitationsSent(auth),
      userApiClient.fetchBlockedUsers(auth),
    ])
      .then(([friendsPage, pendingPage, sentPage, blockedPage]) => {
        setFriends(friendsPage.content);
        setPendingReceived(pendingPage.content);
        setPendingSent(sentPage.content);
        setBlocked(blockedPage.content);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (auth.isAuthenticated) loadData();
  }, [auth.isAuthenticated]);

  const openConfirm = (action: ConfirmAction, friendship: Friendship) => {
    setConfirmDialog({ open: true, action, friendship });
  };

  const closeConfirm = () => {
    setConfirmDialog({ open: false, action: null, friendship: null });
  };

  const handleConfirm = () => {
    const { action, friendship } = confirmDialog;
    if (!action || !friendship) return;
    closeConfirm();
    setActionError(undefined);
    const promise =
      action === 'remove-friend'
        ? userApiClient.removeFriend(friendship.id, auth)
        : userApiClient.updateFriendRequest(friendship.id, 'blocked', auth);
    promise.then(() => loadData()).catch((err) => setActionError(err.message));
  };

  const confirmName =
    confirmDialog.friendship?.addresseeId === auth.user?.profile.sub
      ? confirmDialog.friendship?.requesterName
      : confirmDialog.friendship?.addresseeName;

  const handleRemoveFriend = (friendship: Friendship) => openConfirm('remove-friend', friendship);

  const handleBlock = (friendship: Friendship) => openConfirm('block-user', friendship);

  const handleUnblock = (friendshipId: string) => {
    setActionError(undefined);
    userApiClient
      .removeFriend(friendshipId, auth)
      .then(() => loadData())
      .catch((err) => setActionError(err.message));
  };

  const handleAccept = (friendshipId: string) => {
    setActionError(undefined);
    userApiClient
      .updateFriendRequest(friendshipId, 'accepted', auth)
      .then(() => loadData())
      .catch((err) => setActionError(err.message));
  };

  const handleReject = (friendshipId: string) => {
    setActionError(undefined);
    userApiClient
      .updateFriendRequest(friendshipId, 'rejected', auth)
      .then(() => loadData())
      .catch((err) => setActionError(err.message));
  };

  const handleSendRequest = () => {
    if (!addresseeName.trim()) return;
    setSendError(undefined);
    setSending(true);
    userApiClient
      .sendFriendRequest(addresseeName.trim(), sendMessage, auth)
      .then(() => {
        setSendDialogOpen(false);
        setAddresseeName('');
        setSendMessage('');
        loadData();
      })
      .catch((err) => setSendError(friendErrorMessage(err, t)))
      .finally(() => setSending(false));
  };

  const handleCloseSendDialog = () => {
    setSendDialogOpen(false);
    setAddresseeName('');
    setSendMessage('');
    setSendError(undefined);
  };

  return (
    <Section
      title={t('friends')}
      actions={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<LinkIcon />} onClick={() => setInviteDialogOpen(true)}>
            {t('friend-invite-links')}
          </Button>
          <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setSendDialogOpen(true)}>
            {t('add-friend')}
          </Button>
        </Stack>
      }
    >
      {actionError && (
        <Alert severity="error" onClose={() => setActionError(undefined)} sx={{ mb: 2 }}>
          {actionError}
        </Alert>
      )}

      {loading ? (
        <LoadingState />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
            <Tab icon={<PeopleIcon />} iconPosition="start" label={`${t('friends')} (${friends.length})`} />
            <Tab icon={<MailIcon />} iconPosition="start" label={`${t('received-invitations')} (${pendingReceived.length})`} />
            <Tab icon={<SendIcon />} iconPosition="start" label={`${t('sent-invitations')} (${pendingSent.length})`} />
            <Tab icon={<BlockIcon />} iconPosition="start" label={`${t('blocked-users')} (${blocked.length})`} />
          </Tabs>

          <Divider />

          <TabPanel value={tab} index={0}>
            {friends.length === 0 ? (
              <EmptyState dense title={t('no-friends')} />
            ) : (
              <List disablePadding>
                {friends.map((f) => (
                  <ListItem
                    key={f.id}
                    divider
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <Tooltip title={t('remove-friend')}>
                          <IconButton color="error" onClick={() => handleRemoveFriend(f)}>
                            <PersonRemoveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('block-user')}>
                          <IconButton color="error" onClick={() => handleBlock(f)}>
                            <BlockIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                  >
                    <ListItemText primary={f.addresseeId === auth.user?.profile.sub ? f.requesterName : f.addresseeName} />
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>

          <TabPanel value={tab} index={1}>
            {pendingReceived.length === 0 ? (
              <EmptyState dense title={t('no-pending-invitations')} />
            ) : (
              <List disablePadding>
                {pendingReceived.map((f) => (
                  <ListItem
                    key={f.id}
                    divider
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <Tooltip title={t('accept-invitation')}>
                          <IconButton color="success" onClick={() => handleAccept(f.id)} title={t('accept-invitation')}>
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('decline-invitation')}>
                          <IconButton color="error" onClick={() => handleReject(f.id)} title={t('decline-invitation')}>
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                  >
                    <ListItemText primary={f.requesterName} secondary={f.message || undefined} />
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>

          <TabPanel value={tab} index={2}>
            {pendingSent.length === 0 ? (
              <EmptyState dense title={t('no-sent-invitations')} />
            ) : (
              <List disablePadding>
                {pendingSent.map((f) => (
                  <ListItem key={f.id} divider secondaryAction={<Chip label={t('pending')} color="secondary" />}>
                    <ListItemText primary={f.addresseeName} secondary={f.message || undefined} />
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>

          <TabPanel value={tab} index={3}>
            {blocked.length === 0 ? (
              <EmptyState dense title={t('no-blocked-users')} />
            ) : (
              <List disablePadding>
                {blocked.map((f) => (
                  <ListItem
                    key={f.id}
                    divider
                    secondaryAction={
                      f.blockedBy === auth.user?.profile.sub ? (
                        <IconButton color="primary" onClick={() => handleUnblock(f.id)} title={t('unblock-user')}>
                          <LockOpenIcon />
                        </IconButton>
                      ) : undefined
                    }
                  >
                    <ListItemText primary={f.addresseeId === auth.user?.profile.sub ? f.requesterName : f.addresseeName} />
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>
        </>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
        destructive
        title={confirmDialog.action === 'remove-friend' ? t('remove-friend') : t('block-user')}
        message={t(confirmDialog.action === 'remove-friend' ? 'confirm-remove-friend' : 'confirm-block-user', { name: confirmName })}
      />

      <RmuDialog
        open={sendDialogOpen}
        onClose={handleCloseSendDialog}
        title={t('send-friend-request')}
        maxWidth="sm"
        buttons={
          <Button
            variant="contained"
            onClick={handleSendRequest}
            disabled={!addresseeName.trim() || sending}
            startIcon={sending ? <LoadingState variant="inline" /> : <SendIcon />}
          >
            {t('send')}
          </Button>
        }
      >
        <Stack spacing={2}>
          <TextField
            label={t('friend-nick')}
            helperText={t('friend-nick-help')}
            value={addresseeName}
            onChange={(e) => setAddresseeName(e.target.value)}
            fullWidth
            required
            autoFocus
          />
          <TextField label={t('message')} value={sendMessage} onChange={(e) => setSendMessage(e.target.value)} fullWidth multiline rows={3} />
          {sendError && <Alert severity="error">{sendError}</Alert>}
        </Stack>
      </RmuDialog>

      <FriendInviteDialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} />
    </Section>
  );
}
