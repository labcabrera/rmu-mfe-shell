import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { ApiUser, MANAGED_GROUPS, userApiClient } from '../../api/user-api-client';
import { CountQuery, useAdminCounts } from './useAdminCounts';

/** What the user owns: campaigns, characters and tactical games. */
const OwnedCounts: FC<{ userId: string }> = ({ userId }) => {
  const { t } = useTranslation();
  const queries: CountQuery[] = [
    { key: 'campaigns', counter: 'campaigns', rsql: `owner==${userId}` },
    { key: 'characters', counter: 'characters', rsql: `owner==${userId}` },
    { key: 'tactical', counter: 'tactical', rsql: `owner==${userId}` },
  ];
  const { counts, loading } = useAdminCounts(queries);
  const label: Record<string, string> = { campaigns: 'strategic-games', characters: 'characters', tactical: 'tactical-games' };
  return (
    <Stack direction="row" spacing={3}>
      {queries.map((query) => (
        <Box key={query.key}>
          <Typography variant="h5" sx={{ fontFamily: (theme) => theme.fonts.display, fontWeight: 600 }}>
            {loading ? '…' : (counts[query.key] ?? '—')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t(label[query.key])}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
};

/**
 * Detail of a user for an administrator: what they own, their realm groups and whether the account is enabled. Group
 * changes reach the user's session on their next sign-in.
 */
const UserAdminDrawer: FC<{ user?: ApiUser; onClose: () => void; onChanged: (user: ApiUser) => void }> = ({ user, onClose, onChanged }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const self = user?.id === auth.user?.profile.sub;
  const [groups, setGroups] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setGroups((user?.features ?? []).filter((group) => (MANAGED_GROUPS as readonly string[]).includes(group)));
    setError(undefined);
    setSaved(false);
  }, [user]);

  if (!user) return <Drawer anchor="right" open={false} onClose={onClose} />;

  const run = (action: Promise<ApiUser>) => {
    setSaving(true);
    setError(undefined);
    setSaved(false);
    action
      .then((updated) => {
        onChanged(updated);
        setSaved(true);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setSaving(false));
  };
  const toggle = (group: string) => setGroups((current) => (current.includes(group) ? current.filter((g) => g !== group) : [...current, group]));
  const changed =
    [...groups].sort().join() !==
    (user.features ?? [])
      .filter((g) => (MANAGED_GROUPS as readonly string[]).includes(g))
      .sort()
      .join();

  return (
    <Drawer
      anchor="right"
      open
      onClose={onClose}
      // A temporary drawer sits at the drawer level, under the sticky app bar: this one goes above it, like a dialog.
      sx={{ zIndex: (theme) => theme.zIndex.modal }}
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 420 } } } }}
    >
      <Stack spacing={2.5} sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar src={user.imageUrl ?? undefined} alt="" sx={{ width: 56, height: 56 }}>
            {user.name.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontFamily: (theme) => theme.fonts.display }} noWrap>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user.email}
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label={t('close')}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <OwnedCounts userId={user.id} />
        <Divider />
        <Box>
          <Typography variant="overline" color="text.secondary">
            {t('admin-groups')}
          </Typography>
          <FormGroup>
            {MANAGED_GROUPS.map((group) => (
              <FormControlLabel
                key={group}
                control={
                  <Checkbox checked={groups.includes(group)} onChange={() => toggle(group)} disabled={saving || (self && group === 'rmu-admin')} />
                }
                label={group}
              />
            ))}
          </FormGroup>
          <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 1 }}>
            {t('admin-groups-help')}
          </Typography>
          <Button variant="contained" disabled={!changed || saving} onClick={() => run(userApiClient.updateUserGroups(user.id, groups, auth))}>
            {t('admin-save-groups')}
          </Button>
        </Box>
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={user.enabled !== false}
              disabled={saving || self}
              onChange={(event) => run(userApiClient.setUserEnabled(user.id, event.target.checked, auth))}
            />
          }
          label={t(user.enabled === false ? 'admin-disabled' : 'admin-enabled')}
        />
        {self && <Alert severity="info">{t('admin-self-note')}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        {saved && <Alert severity="success">{t('admin-saved')}</Alert>}
      </Stack>
    </Drawer>
  );
};

export default UserAdminDrawer;
