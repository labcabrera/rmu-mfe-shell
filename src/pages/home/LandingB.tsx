import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Container, Grid, Link, Stack, Typography } from '@mui/material';
import { heroImageOfVisit, LANDING_MODULES } from './modules';
import HeroPanorama from './parts/HeroPanorama';
import { DisclaimerNote, HeroActions, LandingTitle, Ornament } from './parts/LandingParts';
import { LandingData } from './useLandingData';

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

/** Shows its content with a short fade when it enters the viewport (at once with reduced motion). */
const Reveal: FC<{ children: ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    if (visible || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);
  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(8px)',
        transition: 'opacity 600ms ease-out, transform 600ms ease-out',
      }}
    >
      {children}
    </Box>
  );
};

/**
 * Option B, "the illustrated codex": a tall hero whose figures cross-fade, then each module as a chapter with a big
 * illustration, alternating sides, and a chapter index that stays at hand on wide screens.
 */
const LandingB: FC<{ data: LandingData }> = ({ data }) => {
  const { t } = useTranslation();
  const [image] = useState(heroImageOfVisit);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <HeroPanorama start={image} rotateMs={8000} minHeight={{ xs: 'calc(100svh - 120px)', md: 'calc(100vh - 64px)' }}>
        <Stack sx={{ maxWidth: 720 }}>
          <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: { xs: 1.5, md: 3 }, lineHeight: 1.6 }}>
            {t('landing-codex-overline')}
          </Typography>
          <LandingTitle />
          <Ornament />
          <Typography variant="h6" component="p" sx={{ fontWeight: 400, mb: 3, opacity: 0.92 }}>
            {t('shell.home.subtitle')}
          </Typography>
          <HeroActions signedIn={data.signedIn} />
          <Box sx={{ mt: 4 }}>
            <DisclaimerNote onDark />
          </Box>
        </Stack>
      </HeroPanorama>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container spacing={{ xs: 2, lg: 6 }}>
          <Grid size={{ xs: 12, lg: 3 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Stack component="nav" aria-label={t('landing-modules')} spacing={1} sx={{ position: 'sticky', top: 96 }}>
              <Typography variant="overline" color="text.secondary">
                {t('landing-modules')}
              </Typography>
              {LANDING_MODULES.map((module, index) => (
                <Link
                  key={module.id}
                  href={`#chapter-${module.id}`}
                  underline="hover"
                  color="text.primary"
                  sx={{ fontFamily: (theme) => theme.fonts.display, fontSize: '1.05rem' }}
                >
                  {`${NUMERALS[index]}. ${t(module.id)}`}
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 9 }}>
            <Stack spacing={{ xs: 5, md: 9 }}>
              {LANDING_MODULES.map((module, index) => (
                <Reveal key={module.id}>
                  <Grid
                    id={`chapter-${module.id}`}
                    container
                    spacing={{ xs: 2, md: 5 }}
                    direction={{ xs: 'row', md: index % 2 === 0 ? 'row' : 'row-reverse' }}
                    sx={{ alignItems: 'center', scrollMarginTop: 96 }}
                  >
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Box
                        component="img"
                        src={module.img}
                        alt=""
                        sx={{
                          width: '100%',
                          aspectRatio: { xs: '16 / 9', md: '4 / 3' },
                          objectFit: 'cover',
                          borderRadius: 2,
                          boxShadow: 6,
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Typography sx={{ fontFamily: (theme) => theme.fonts.display, color: 'primary.main', fontSize: '1.25rem' }}>
                        {t('landing-chapter', { numeral: NUMERALS[index] })}
                      </Typography>
                      <Typography
                        variant="h3"
                        component="h2"
                        sx={{ fontFamily: (theme) => theme.fonts.display, fontSize: { xs: '2rem', md: '2.75rem' } }}
                      >
                        {t(module.id)}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, mb: 2.5, maxWidth: 620 }}>
                        {t(module.desc)}
                      </Typography>
                      <Button component={RouterLink} to={module.href} endIcon={<ArrowForwardIcon />} variant="outlined">
                        {t('landing-open-module', { module: t(module.id) })}
                      </Button>
                    </Grid>
                  </Grid>
                </Reveal>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingB;
