import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LightModeIcon from '@mui/icons-material/LightMode';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import { imageBaseUrl } from '../../services/config';

type UserProfileProps = {
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
};

const UserProfile: React.FC<UserProfileProps> = ({ themeMode, onThemeModeChange }) => {
  const auth = useAuth();
  const { i18n } = useTranslation();
  const user = auth.user;

  const username = auth.user?.profile.preferred_username || 'Unknown';
  const email = user?.profile.email || 'Not defined email';

  const [lang, setLang] = useState<string>(() => {
    try {
      return localStorage.getItem('locale') || i18n.language || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('locale', lang);
    } catch {}
    void i18n.changeLanguage(lang);
  }, [i18n, lang]);

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

  const handleThemeModeChange = (_: React.MouseEvent<HTMLElement>, value: ThemeMode | null) => {
    if (value) onThemeModeChange(value);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ p: { xs: 2, md: 3 } }} elevation={2}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}>
            <Avatar sx={{ width: 80, height: 80 }} src={`${imageBaseUrl}images/generic/races.png`}>
              {username[0]}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5">{username}</Typography>
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

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Profile details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 2,
                  overflow: 'auto',
                  borderRadius: 1,
                  color: 'text.secondary',
                  bgcolor: 'background.default',
                  fontSize: 12,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {JSON.stringify(user?.profile || {}, null, 2)}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Paper>
    </Container>
  );
};

export default UserProfile;
