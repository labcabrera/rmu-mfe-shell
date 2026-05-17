import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import AddIcon from '@mui/icons-material/Add';
import ComputerIcon from '@mui/icons-material/Computer';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import type { ThemeMode } from '../../App';
import type { ApiUser } from '../../api/user-api-client';
import { userApiClient } from '../../api/user-api-client';
import { imageBaseUrl } from '../../services/config';
import ImageDialog from '../images/ImageDialog';
import ActivationCodeDialog from './ActivationCodeDialog';
import FriendPanel from './FriendPanel';

const DEFAULT_IMAGE = `${imageBaseUrl}images/generic/races.png`;

export default function UserProfile({ themeMode, onThemeModeChange }: { themeMode: ThemeMode; onThemeModeChange: (mode: ThemeMode) => void }) {
  const { user } = useAuth();
  const auth = useAuth();
  const { t } = useTranslation();
  const [activationCodeDialogOpen, setActivationCodeDialogOpen] = useState<boolean>(false);
  const [imageDialogOpen, setImageDialogOpen] = useState<boolean>(false);
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

  const updateImage = (imageUrl: string) => {
    userApiClient
      .updateCurrentUser({ imageUrl }, auth)
      .then((response) => setApiUser(response))
      .catch((err) => console.error(err));
  };

  const handleThemeModeChange = (_: React.MouseEvent<HTMLElement>, value: ThemeMode | null) => {
    if (value) onThemeModeChange(value);
  };

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

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper sx={{ p: { xs: 2, md: 3 } }} elevation={2}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}>
            <IconButton aria-label="change profile image" onClick={() => setImageDialogOpen(true)} sx={{ p: 0 }}>
              <Avatar sx={{ width: 80, height: 80 }} src={apiUser?.imageUrl || DEFAULT_IMAGE}>
                {avatarInitials}
              </Avatar>
            </IconButton>
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

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                    <SecurityIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {t('enabled-features')}
                    </Typography>
                  </Stack>
                </Box>
                {groups.length === 0 ? (
                  <Alert severity="error">{t('user-has-no-groups')}</Alert>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {groups.map((feature, index) => (
                      <Chip key={index} label={t(feature)} variant="outlined" color="success" size="small" />
                    ))}
                  </Box>
                )}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setActivationCodeDialogOpen(true)}
                  sx={{ mt: 'auto', borderStyle: 'dashed' }}
                >
                  {t('add-activation-code')}
                </Button>
              </Paper>
            </Grid>

            {/* Preferences */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                    <SettingsIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {t('settings')}
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {t('theme')}
                  </Typography>
                  <ToggleButtonGroup color="primary" exclusive value={themeMode} onChange={handleThemeModeChange} size="small">
                    <ToggleButton value="light">
                      <LightModeIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {t('light')}
                    </ToggleButton>
                    <ToggleButton value="dark">
                      <DarkModeIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {t('dark')}
                    </ToggleButton>
                    <ToggleButton value="system">
                      <ComputerIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {t('system')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {t('units')}
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <Select value={unit} onChange={(e: SelectChangeEvent<string>) => setUnit(e.target.value)}>
                      <MenuItem value="metric">{t('metric')}</MenuItem>
                      <MenuItem value="imperial">{t('imperial')}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>
            </Grid>
          </Grid>

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
      <ImageDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onImageSelected={(image) => updateImage(image.url)}
        onImageUploaded={(image) => updateImage(image.url)}
      />
    </Container>
  );
}
