import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useLocation } from 'react-router-dom';
import { Alert, Button, Snackbar } from '@mui/material';

/**
 * Workspace spec 091, A9: the session can no longer be renewed in the background. Warns before the token expires, so a
 * form is not lost at the next request; a renewal that works later (or a new sign-in) removes the warning.
 */
const SessionRenewalNotice: FC = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const location = useLocation();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const removeError = auth.events.addSilentRenewError(() => setFailed(true));
    const removeLoaded = auth.events.addUserLoaded(() => setFailed(false));
    return () => {
      removeError();
      removeLoaded();
    };
  }, [auth.events]);

  if (!failed) return null;

  const signIn = () => void auth.signinRedirect({ state: { returnTo: `${location.pathname}${location.search}` } });

  return (
    <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert
        severity="warning"
        action={
          <Button color="inherit" size="small" onClick={signIn}>
            {t('session-renew-sign-in')}
          </Button>
        }
      >
        {t('session-renew-failed')}
      </Alert>
    </Snackbar>
  );
};

export default SessionRenewalNotice;
