import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MailIcon from '@mui/icons-material/Mail';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import type { Friendship } from '../../api/user-api-client';
import { userApiClient } from '../../api/user-api-client';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [addresseeName, setAddresseeName] = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [sendError, setSendError] = useState<string>();
  const [sending, setSending] = useState(false);

  const [actionError, setActionError] = useState<string>();

  const loadData = () => {
    setLoading(true);
    setError(undefined);
    setActionError(undefined);
    Promise.all([userApiClient.fetchFriends(auth), userApiClient.fecthInvitationsPending(auth), userApiClient.fecthInvitationsSent(auth)])
      .then(([friendsPage, pendingPage, sentPage]) => {
        setFriends(friendsPage.content);
        setPendingReceived(pendingPage.content);
        setPendingSent(sentPage.content);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (auth.isAuthenticated) loadData();
  }, [auth.isAuthenticated]);

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
      .catch((err) => setSendError(err.message))
      .finally(() => setSending(false));
  };

  const handleCloseSendDialog = () => {
    setSendDialogOpen(false);
    setAddresseeName('');
    setSendMessage('');
    setSendError(undefined);
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }} elevation={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{t('friends')}</Typography>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setSendDialogOpen(true)}>
          {t('add-friend')}
        </Button>
      </Stack>

      {actionError && (
        <Alert severity="error" onClose={() => setActionError(undefined)} sx={{ mb: 2 }}>
          {actionError}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
            <Tab icon={<PeopleIcon />} iconPosition="start" label={`${t('friends')} (${friends.length})`} />
            <Tab icon={<MailIcon />} iconPosition="start" label={`${t('received-invitations')} (${pendingReceived.length})`} />
            <Tab icon={<SendIcon />} iconPosition="start" label={`${t('sent-invitations')} (${pendingSent.length})`} />
          </Tabs>

          <Divider />

          <TabPanel value={tab} index={0}>
            {friends.length === 0 ? (
              <Typography color="text.secondary">{t('no-friends')}</Typography>
            ) : (
              <List disablePadding>
                {friends.map((f) => (
                  <ListItem key={f.id} divider>
                    <ListItemText primary={f.addresseeId === auth.user?.profile.sub ? f.requesterName : f.addresseeName} />
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>

          <TabPanel value={tab} index={1}>
            {pendingReceived.length === 0 ? (
              <Typography color="text.secondary">{t('no-pending-invitations')}</Typography>
            ) : (
              <List disablePadding>
                {pendingReceived.map((f) => (
                  <ListItem
                    key={f.id}
                    divider
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <IconButton color="success" onClick={() => handleAccept(f.id)} title={t('accept')}>
                          <CheckIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleReject(f.id)} title={t('reject')}>
                          <CloseIcon />
                        </IconButton>
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
              <Typography color="text.secondary">{t('no-sent-invitations')}</Typography>
            ) : (
              <List disablePadding>
                {pendingSent.map((f) => (
                  <ListItem key={f.id} divider secondaryAction={<Chip label={t('pending')} size="small" color="warning" />}>
                    <ListItemText primary={f.addresseeName} secondary={f.message || undefined} />
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>
        </>
      )}

      <Dialog open={sendDialogOpen} onClose={handleCloseSendDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {t('send-friend-request')}
          <IconButton aria-label="close" onClick={handleCloseSendDialog} sx={{ position: 'absolute', right: 8, top: 8 }} size="large">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label={t('username')} value={addresseeName} onChange={(e) => setAddresseeName(e.target.value)} fullWidth required />
            <TextField label={t('message')} value={sendMessage} onChange={(e) => setSendMessage(e.target.value)} fullWidth multiline rows={3} />
            {sendError && <Alert severity="error">{sendError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSendDialog}>{t('cancel')}</Button>
          <Button
            variant="contained"
            onClick={handleSendRequest}
            disabled={!addresseeName.trim() || sending}
            startIcon={sending ? <CircularProgress size={16} /> : <SendIcon />}
          >
            {t('send')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
