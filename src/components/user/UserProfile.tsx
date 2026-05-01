import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Avatar,
  Box,
  Container,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

const UserProfile = () => {
  const auth = useAuth();
  const user = auth.user;

  const username = auth.user?.profile.preferred_username || 'Unknown';
  const email = user?.profile.email || 'Not defined email';

  const [lang, setLang] = useState<string>(() => {
    try {
      return (localStorage.getItem('lang') as string) || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lang', lang);
    } catch {}
  }, [lang]);

  const [unit, setUnit] = useState<string>(() => {
    try {
      return (localStorage.getItem('unit') as string) || 'metric';
    } catch {
      return 'metric';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('unit', unit);
    } catch {}
  }, [unit]);

  return (
    <Container maxWidth="lg" sx={{ mt: 1 }}>
      <Paper sx={{ p: 1 }} elevation={2}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ width: 80, height: 80 }} src="http://localhost:4000/images/generic/races.png">
            {username[0]}
          </Avatar>
          <Box>
            <Typography variant="h5">{username}</Typography>
            {email && (
              <Typography variant="body2" color="text.secondary">
                {email}
              </Typography>
            )}
          </Box>
        </Box>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel id="lang-select-label">Language</InputLabel>
          <Select
            labelId="lang-select-label"
            id="lang-select"
            value={lang}
            label="Language"
            onChange={(e: SelectChangeEvent<string>) => setLang(e.target.value as string)}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Español</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel id="unit-select-label">Units</InputLabel>
          <Select
            labelId="unit-select-label"
            id="unit-select"
            value={unit}
            label="Units"
            onChange={(e: SelectChangeEvent<string>) => setUnit(e.target.value as string)}
          >
            <MenuItem value="metric">Metric</MenuItem>
            <MenuItem value="imperial">Imperial</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="subtitle1" gutterBottom>
          Profile details
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(user || {}, null, 2)}</pre>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Container>
  );
};

export default UserProfile;
