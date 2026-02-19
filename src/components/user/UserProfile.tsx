import React from 'react';
import { Avatar, Box, Container, Typography, Paper } from '@mui/material';
import { useAuth } from '../../services/auth/AuthProvider';

const UserProfile = () => {
  const { user } = useAuth();

  const username = user?.username || user?.preferred_username || 'Usuario';
  const email = user?.email || user?.email_verified || '';

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }} elevation={2}>
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

        <Typography variant="subtitle1" gutterBottom>
          Profile details
        </Typography>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(user || {}, null, 2)}</pre>
      </Paper>
    </Container>
  );
};

export default UserProfile;
