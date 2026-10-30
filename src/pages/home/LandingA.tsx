import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { useApiUser } from '../../services/user/ApiUserProvider';
import { heroImageOfVisit, LANDING_MODULES } from './modules';
import HeroPanorama from './parts/HeroPanorama';
import { ContinuePanel, DisclaimerNote, HeroActions, LandingTitle, SectionTitle, UserTable } from './parts/LandingParts';
import { ModuleCard } from './parts/ModuleTile';
import { LandingData } from './useLandingData';

/**
 * Option A, "the game master's table": a compact hero with the greeting and where to go on, then the modules as
 * tiles and, at their side, the user's games, campaigns and characters.
 */
const LandingA: FC<{ data: LandingData }> = ({ data }) => {
  const { t } = useTranslation();
  const { apiUser } = useApiUser();
  const [image] = useState(heroImageOfVisit);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <HeroPanorama start={image} minHeight={{ xs: 'auto', md: 340 }}>
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            {data.signedIn && apiUser?.name && (
              <Typography variant="overline" sx={{ opacity: 0.8 }}>
                {t('landing-welcome', { name: apiUser.name })}
              </Typography>
            )}
            <LandingTitle size="medium" />
            <Typography variant="body1" sx={{ maxWidth: 560, mt: 1.5, mb: 2.5, opacity: 0.9 }}>
              {t('shell.home.subtitle')}
            </Typography>
            <HeroActions signedIn={data.signedIn} />
          </Grid>
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <ContinuePanel data={data} />
          </Grid>
        </Grid>
      </HeroPanorama>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid size={{ xs: 12, lg: data.signedIn ? 8 : 12 }}>
            <SectionTitle>{t('landing-modules')}</SectionTitle>
            <Grid container spacing={2}>
              {LANDING_MODULES.map((module, index) => (
                <Grid key={module.id} size={{ xs: 12, sm: 6, md: 4, lg: data.signedIn ? 4 : 2 }}>
                  <ModuleCard module={module} index={index} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          {data.signedIn && (
            <Grid size={{ xs: 12, lg: 4 }}>
              <SectionTitle>{t('landing-your-table')}</SectionTitle>
              <UserTable data={data} />
            </Grid>
          )}
        </Grid>
        <Stack sx={{ mt: 4 }}>
          <DisclaimerNote />
        </Stack>
      </Container>
    </Box>
  );
};

export default LandingA;
