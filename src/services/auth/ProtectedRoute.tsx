import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useLocation } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const returnTo = `${location.pathname}${location.search}${location.hash}`;

  if (auth.isLoading || auth.activeNavigator) {
    return (
      <Box sx={{ display: 'grid', minHeight: 320, placeItems: 'center' }}>
        <CircularProgress aria-label="Loading authentication state" />
      </Box>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <Box sx={{ display: 'grid', minHeight: 320, placeItems: 'center', px: 2 }}>
        <Paper sx={{ maxWidth: 420, p: 3, textAlign: 'center' }} elevation={2}>
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant="h5">{t('authRequiredTitle', 'Sign in required')}</Typography>
            <Typography color="text.secondary">
              {t('authRequiredDescription', 'You need to sign in before viewing this page.')}
            </Typography>
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={() => auth.signinRedirect({ state: { returnTo } })}
            >
              {t('login')}
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
