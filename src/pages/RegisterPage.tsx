import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Alert, alpha, Box, Button, Container, Divider, Link, Stack, Typography } from '@mui/material';
import { imageBaseUrl } from '../services/config';

/** Keycloak alias of the Google identity provider (rmu-platform terraform, module keycloak). */
const GOOGLE_IDP = 'google';

/**
 * Sign-up (workspace spec 103, decision 5). Both buttons go to Keycloak, which owns the accounts:
 * - `prompt=create` (OIDC, Keycloak 26) opens its registration form directly instead of the sign-in;
 * - `kc_idp_hint=google` skips Keycloak's page and goes to Google, creating the account on the first sign-in.
 * New accounts see the application and the wiki; the book content needs an activation code (profile).
 */
export default function RegisterPage() {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate('/', { replace: true });
  }, [auth.isAuthenticated, navigate]);

  const state = { returnTo: '/' };
  const createAccount = () => void auth.signinRedirect({ prompt: 'create', state });
  const continueWithGoogle = () => void auth.signinRedirect({ extraQueryParams: { kc_idp_hint: GOOGLE_IDP }, state });
  const signIn = () => void auth.signinRedirect({ state });

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        sx={(theme) => ({
          minHeight: '32vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(to right, ${alpha(theme.palette.common.black, 0.6)}, ${alpha(theme.palette.common.black, 0.2)}), url(${imageBaseUrl}images/backgrounds/scene-02.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'common.white',
        })}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
            {t('register-title')}
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 640 }}>
            {t('register-intro')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Stack spacing={2}>
          <Button variant="contained" size="large" startIcon={<PersonAddIcon />} onClick={createAccount} disabled={auth.isLoading}>
            {t('register-create-account')}
          </Button>
          <Button variant="outlined" size="large" startIcon={<GoogleIcon />} onClick={continueWithGoogle} disabled={auth.isLoading}>
            {t('register-continue-google')}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            {t('register-email-verification')}
          </Typography>

          <Alert severity="info" variant="outlined">
            <Typography variant="subtitle2" gutterBottom>
              {t('register-books-title')}
            </Typography>
            <Typography variant="body2">{t('register-books-text')}</Typography>
          </Alert>

          <Divider />
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              {t('register-have-account')}
            </Typography>
            <Button size="small" startIcon={<LoginIcon />} onClick={signIn}>
              {t('login')}
            </Button>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/privacy-policy">
              {t('register-privacy')}
            </Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
