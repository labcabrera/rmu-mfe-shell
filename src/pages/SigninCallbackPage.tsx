import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress } from '@mui/material';

const SigninCallbackPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: 'grid', minHeight: 320, placeItems: 'center' }}>
      <CircularProgress aria-label={t('completing-sign-in')} />
    </Box>
  );
};

export default SigninCallbackPage;
