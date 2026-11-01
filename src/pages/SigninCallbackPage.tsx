import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { LoadingState } from '@labcabrera-rmu/rmu-react-shared-lib';

const SigninCallbackPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box role="status" aria-label={t('completing-sign-in')} sx={{ display: 'grid', minHeight: 320, placeItems: 'center' }}>
      <LoadingState />
    </Box>
  );
};

export default SigninCallbackPage;
