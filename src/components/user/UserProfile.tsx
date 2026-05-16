import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { maxWidth } from '@mui/system';
import type { ThemeMode } from '../../App';
import type { ApiUser } from '../../api/user-api-client';
import { userApiClient } from '../../api/user-api-client';
import { imageBaseUrl } from '../../services/config';
import ActivationCodeDialog from './ActivationCodeDialog';
import FriendPanel from './FriendPanel';

export default function UserProfile({ themeMode, onThemeModeChange }: { themeMode: ThemeMode; onThemeModeChange: (mode: ThemeMode) => void }) {
  const { user } = useAuth();
  const auth = useAuth();
  const { t } = useTranslation();
  const [activationCodeDialogOpen, setActivationCodeDialogOpen] = useState<boolean>(false);
  const [apiUser, setApiUser] = useState<ApiUser>();
  const groups: string[] = (auth.user?.profile.groups as string[]) || [];

  const username = user?.profile.preferred_username || user?.profile.name || 'Unknown';
  const email = user?.profile.email || 'Not defined email';
  const displayName = user?.profile.name || username;
  const avatarInitials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const [unit, setUnit] = useState<string>(() => {
    try {
      return localStorage.getItem('unit') || 'metric';
    } catch {
      return 'metric';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('unit', unit);
    } catch {}
  }, [unit]);

  useEffect(() => {
    if (!auth) return;
    console.log('User profile loaded. Fetching user data...');
    userApiClient
      .fetchUser(auth)
      .then((response) => setApiUser(response))
      .catch((err) => console.error(err));
  }, [auth]);

  const handleThemeModeChange = (_: React.MouseEvent<HTMLElement>, value: ThemeMode | null) => {
    if (value) onThemeModeChange(value);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper sx={{ p: { xs: 2, md: 3 } }} elevation={2}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}>
            <Avatar sx={{ width: 80, height: 80 }} src={`${imageBaseUrl}images/generic/races.png`}>
              {avatarInitials}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5">{displayName}</Typography>
              {email && (
                <Typography variant="body2" color="text.secondary">
                  {email}
                </Typography>
              )}
            </Box>
          </Stack>

          <Divider />

          <Box>
            <Typography variant="h6">{t('enabled-features')}</Typography>
            {groups.length === 0 ? (
              <>
                <Alert color="error">{t('user-has-no-groups')}</Alert>
              </>
            ) : (
              <>
                <Stack direction="row" spacing={1}>
                  {groups.map((feature, index) => (
                    <Chip key={index} label={t(feature)} color="success" />
                  ))}
                </Stack>
              </>
            )}
            <Button variant="contained" onClick={() => setActivationCodeDialogOpen(true)} sx={{ mt: 1 }}>
              {t('add-activation-code')}
            </Button>
          </Box>

          <Divider />

          <Stack spacing={2}>
            <Typography variant="h6">{t('settings')}</Typography>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('theme')}
              </Typography>
              <ToggleButtonGroup color="primary" exclusive value={themeMode} onChange={handleThemeModeChange} aria-label="theme mode">
                <ToggleButton value="light" aria-label="light theme">
                  <LightModeIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="dark" aria-label="dark theme">
                  <DarkModeIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ maxWidth: 300 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="unit-select-label">Units</InputLabel>
                <Select
                  labelId="unit-select-label"
                  id="unit-select"
                  value={unit}
                  label="Units"
                  onChange={(e: SelectChangeEvent<string>) => setUnit(e.target.value)}
                >
                  <MenuItem value="metric">Metric</MenuItem>
                  <MenuItem value="imperial">Imperial</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>

          <Divider />

          <FriendPanel />

          <Divider />

          <Stack spacing={1}>
            <Typography variant="h6">Profile details</Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  {t('username')}
                </Box>{' '}
                {username}
              </Typography>
              <Typography variant="body2">
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  {t('email')}
                </Box>{' '}
                {email}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Box
          sx={{
            p: 2,
            borderRadius: 1,
            overflowX: 'auto',
            maxWidth: '100%',
          }}
        >
          <Typography>API User</Typography>
          <Typography
            component="pre"
            sx={{
              fontFamily: 'monospace',
              fontSize: 12,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              m: 0,
            }}
          >
            {JSON.stringify(apiUser, null, 2)}
          </Typography>
          <Typography>JWT</Typography>
          <Typography
            component="pre"
            sx={{
              fontFamily: 'monospace',
              fontSize: 12,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              m: 0,
            }}
          >
            {auth.user?.access_token}
          </Typography>
          <Typography>Auth</Typography>
          <Typography
            component="pre"
            sx={{
              fontFamily: 'monospace',
              fontSize: 12,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              m: 0,
            }}
          >
            {JSON.stringify(auth, null, 2)}
          </Typography>
          <Typography>Groups</Typography>
          <Typography
            component="pre"
            sx={{
              fontFamily: 'monospace',
              fontSize: 12,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              m: 0,
            }}
          >
            {JSON.stringify(auth.user?.profile.groups, null, 2)}
          </Typography>
        </Box>
      </Paper>
      <ActivationCodeDialog open={activationCodeDialogOpen} onClose={() => setActivationCodeDialogOpen(false)} />
    </Container>
  );
}
