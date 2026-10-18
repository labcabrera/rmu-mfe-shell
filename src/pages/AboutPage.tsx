import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Link } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import type { TFunction } from 'i18next';
import { imageBaseUrl } from '../services/config';

const paragraphSx = { lineHeight: 1.9, color: 'text.secondary' };

const buildSections = (t: TFunction) => [
  {
    title: t('about-app-title'),
    text: (
      <>
        <Typography variant="body1" sx={paragraphSx}>
          <Trans
            i18nKey="about-app-text-1"
            components={{ link: <Link href="https://ironcrown.co.uk/rolemaster-fantasy-role-playing/" target="_blank" /> }}
          />
        </Typography>
        <Typography variant="body1" sx={{ ...paragraphSx, mt: 2 }}>
          {t('about-app-text-2')}
        </Typography>
        <Typography variant="body1" sx={{ ...paragraphSx, mt: 2 }}>
          {t('about-app-text-3')}
        </Typography>
      </>
    ),
    image: `${imageBaseUrl}images/photos/photo-combat-01.jpg`,
    imageText: t('about-app-image-text'),
  },
  {
    title: t('about-before-title'),
    text: (
      <>
        <Typography variant="body1" sx={{ ...paragraphSx, fontSize: '1.2rem' }}>
          {t('about-before-text-1')}
        </Typography>
        <Typography variant="body1" sx={{ ...paragraphSx, fontSize: '1.5rem', mt: 2 }}>
          {t('about-before-text-2')}
        </Typography>
      </>
    ),
    image: `${imageBaseUrl}images/photos/photo-chin-01.png`,
    imageText: t('about-before-image-text'),
  },
  {
    title: t('about-now-title'),
    text: (
      <>
        <Typography variant="body1" sx={paragraphSx}>
          {t('about-now-text-1')}
        </Typography>
        <Typography variant="body1" sx={{ ...paragraphSx, mt: 2 }}>
          {t('about-now-text-2')}
        </Typography>
        <Typography variant="body1" sx={{ ...paragraphSx, mt: 2 }}>
          {t('about-now-text-3')}
        </Typography>
      </>
    ),
    image: `${imageBaseUrl}images/photos/photo-preparing-game-01.png`,
    imageText: t('about-now-image-text'),
  },
  {
    title: t('about-motivation-title'),
    text: (
      <>
        <Typography variant="body1" sx={paragraphSx}>
          {t('about-motivation-text-1')}
        </Typography>
        <Typography variant="body1" sx={{ ...paragraphSx, mt: 2 }}>
          {t('about-motivation-text-2')}
        </Typography>
        <Typography variant="body1" sx={{ ...paragraphSx, mt: 2 }}>
          {t('about-motivation-text-3')}
        </Typography>
      </>
    ),
    image: `${imageBaseUrl}images/photos/photo-board-01.jpeg`,
    imageText: t('about-motivation-image-text'),
  },
  {
    title: t('about-testing-title'),
    text: (
      <>
        <Typography variant="body1" sx={paragraphSx}>
          {t('about-testing-text-1')}
        </Typography>
        <Typography variant="body1" sx={{ ...paragraphSx, mt: 2 }}>
          {t('about-testing-text-2')}
        </Typography>
        <Typography variant="body1" sx={{ ...paragraphSx, mt: 2 }}>
          {t('about-testing-text-3')}
        </Typography>
      </>
    ),
    image: `${imageBaseUrl}images/photos/photo-combat-02.jpeg`,
    imageText: '',
  },
];

export default function AboutPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const sections = buildSections(t);
  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        sx={{
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.2)), url(${imageBaseUrl}images/actions/action-melee-all.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
            {t('footer-about-me')}
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }}>
            {t('about-intro-1')}
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }}>
            {t('about-intro-2')}
          </Typography>
          <Button variant="contained" color="secondary" onClick={() => navigate('/contact')} sx={{ mb: 2 }}>
            {t('about-contact-me')}
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {sections.map((section, index) => {
          const isReversed = index % 2 === 1;

          return (
            <Grid
              container
              spacing={6}
              key={section.title}
              sx={{ mb: 10, alignItems: 'center', flexDirection: { xs: 'column-reverse', md: isReversed ? 'row-reverse' : 'row' } }}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  component="img"
                  src={section.image}
                  alt={section.title}
                  sx={{
                    width: '100%',
                    height: { xs: 280, md: 420 },
                    objectFit: 'cover',
                    borderRadius: 4,
                    boxShadow: 4,
                  }}
                />
                <Typography variant="body1" color="secondary" sx={{ mt: 1 }}>
                  <em>{section.imageText}</em>
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                  {section.title}
                </Typography>
                {section.text}
              </Grid>
            </Grid>
          );
        })}
      </Container>
    </Box>
  );
}
