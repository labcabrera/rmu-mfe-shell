import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {
  Avatar,
  Box,
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
import type { ThemeMode } from '../../App';
import type { ApiUser } from '../../api/user-api-client';
import { userApiClient } from '../../api/user-api-client';
import { imageBaseUrl } from '../../services/config';
import ActivationCodeForm from './ActivationCodeForm';

export default function UserProfile({ themeMode, onThemeModeChange }: { themeMode: ThemeMode; onThemeModeChange: (mode: ThemeMode) => void }) {
  const { user } = useAuth();
  const auth = useAuth();
  const { i18n } = useTranslation();
  const [apiUser, setApiUser] = useState<ApiUser>();

  const username = user?.profile.preferred_username || user?.profile.name || 'Unknown';
  const email = user?.profile.email || 'Not defined email';
  const displayName = user?.profile.name || username;
  const avatarInitials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const [lang, setLang] = useState<string>(() => {
    try {
      return localStorage.getItem('locale') || i18n.language || 'en';
    } catch {
      return 'en';
    }
  });
  const [unit, setUnit] = useState<string>(() => {
    try {
      return localStorage.getItem('unit') || 'metric';
    } catch {
      return 'metric';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('locale', lang);
    } catch {}
    void i18n.changeLanguage(lang);
  }, [i18n, lang]);

  useEffect(() => {
    try {
      localStorage.setItem('unit', unit);
    } catch {}
  }, [unit]);

  useEffect(() => {
    if (!auth) return;
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

          <Stack spacing={2}>
            <Typography variant="h6">Settings</Typography>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Theme
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

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="lang-select-label">Language</InputLabel>
                <Select
                  labelId="lang-select-label"
                  id="lang-select"
                  value={lang}
                  label="Language"
                  onChange={(e: SelectChangeEvent<string>) => setLang(e.target.value)}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Español</MenuItem>
                </Select>
              </FormControl>

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

          <Stack spacing={1}>
            <ActivationCodeForm />
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="h6">Profile details</Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  Username:
                </Box>{' '}
                {username}
              </Typography>
              <Typography variant="body2">
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  Email:
                </Box>{' '}
                {email}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Box>
          <pre>User info:{JSON.stringify(apiUser, null, 2)}</pre>
        </Box>
        <Box>
          <pre>JWT: {auth.user?.access_token}</pre>
        </Box>
      </Paper>
    </Container>
  );
}
