import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const SigninCallbackPage: React.FC = () => (
  <Box sx={{ display: 'grid', minHeight: 320, placeItems: 'center' }}>
    <CircularProgress aria-label="Completing sign in" />
  </Box>
);

export default SigninCallbackPage;
