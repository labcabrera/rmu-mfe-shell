import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useLocation } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Button } from '@mui/material';
import { LoadingState, MessageScreen } from '@labcabrera-rmu/rmu-react-shared-lib';
import { useAuthPending } from './session-restore';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  const pending = useAuthPending();

  const returnTo = `${location.pathname}${location.search}${location.hash}`;

  // A signed-in user keeps the page while a silent renew runs, so the remote is not unmounted.
  if (pending && !auth.isAuthenticated) {
    return (
      <Box role="status" aria-label={t('loading-authentication-state')} sx={{ display: 'grid', minHeight: 320, placeItems: 'center' }}>
        <LoadingState />
      </Box>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <MessageScreen
        title={t('auth-required-title', 'Sign in required')}
        text={t('auth-required-description', 'You need to sign in before viewing this page.')}
        action={
          <Button variant="contained" startIcon={<LoginIcon />} onClick={() => auth.signinRedirect({ state: { returnTo } })}>
            {t('login')}
          </Button>
        }
      />
    );
  }

  return children;
};

export default ProtectedRoute;
