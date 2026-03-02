import React, { useEffect, useState } from 'react';
import { Avatar, Box, Container, Typography, Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useAuth } from '../../services/auth/AuthProvider';

const UserProfile = () => {
  const { user } = useAuth();

  const username = user?.username || user?.preferred_username || 'Usuario';
  const email = user?.email || user?.email_verified || '';

  const [lang, setLang] = useState<string>(() => {
    try {
      return (localStorage.getItem('lang') as string) || 'en';
    } catch (e) {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lang', lang);
    } catch (e) {}
  }, [lang]);

  return (
    <Container maxWidth="sm" sx={{ mt: 1 }}>
      <Paper sx={{ p: 1 }} elevation={2}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ width: 80, height: 80 }}>{username[0]}</Avatar>
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

        <Typography variant="subtitle1" gutterBottom>
          Profile details
        </Typography>

        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(user || {}, null, 2)}</pre>
      </Paper>
    </Container>
  );
};

export default UserProfile;
