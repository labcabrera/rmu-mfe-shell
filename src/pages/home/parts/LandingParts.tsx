import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Link as RouterLink } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Button, Link, Stack, Typography } from '@mui/material';

/** Product name, not translated. */
const PRODUCT_NAME = 'Rolemaster Unified Companion';

/** The product name in the display font of the theme. */
export const LandingTitle: FC = () => (
  <Typography
    component="h1"
    sx={{
      fontFamily: (theme) => theme.fonts.display,
      fontWeight: 600,
      lineHeight: 1.05,
      fontSize: { xs: '2.25rem', sm: '3rem', md: '4rem' },
      textShadow: '0 2px 12px rgba(0,0,0,0.5)',
    }}
  >
    {PRODUCT_NAME}
  </Typography>
);

/** A thin ornament under a title: a line, a diamond and a line, in the primary color. */
export const Ornament: FC = () => (
  <Stack direction="row" spacing={1} aria-hidden sx={{ alignItems: 'center', color: 'primary.light', my: 1.5 }}>
    <Box sx={{ width: 48, height: '1px', bgcolor: 'currentColor', opacity: 0.7 }} />
    <Box sx={{ width: 8, height: 8, border: '1px solid currentColor', transform: 'rotate(45deg)' }} />
    <Box sx={{ width: 48, height: '1px', bgcolor: 'currentColor', opacity: 0.7 }} />
  </Stack>
);

/** The main actions of the hero: sign in when signed out, else start a campaign; the guide in both. */
export const HeroActions: FC = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  return (
    <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', rowGap: 1.5 }}>
      {auth.isAuthenticated ? (
        <Button variant="contained" size="large" component={RouterLink} to="/strategic/games/create">
          {t('shell.home.start-campaign')}
        </Button>
      ) : (
        <Button variant="contained" size="large" startIcon={<LoginIcon />} onClick={() => void auth.signinRedirect()}>
          {t('landing-sign-in')}
        </Button>
      )}
      <Button variant="outlined" size="large" component={RouterLink} to="/docs" sx={{ color: 'common.white', borderColor: 'rgba(255,255,255,0.6)' }}>
        {t('shell.home.get-started')}
      </Button>
    </Stack>
  );
};

/** The non-affiliation note, small, on the dark hero. */
export const DisclaimerNote: FC = () => (
  <Typography variant="caption" component="p" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 760, '& a': { color: 'inherit' } }}>
    <Trans i18nKey="home-disclaimer" components={{ link: <Link href="https://ironcrown.co.uk/" /> }} />
  </Typography>
);
