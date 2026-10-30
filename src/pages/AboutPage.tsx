import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import { Box, Button, Grid, Link, Stack, Typography } from '@mui/material';
import { imageBaseUrl } from '../services/config';
import Reveal from './home/parts/Reveal';
import InfoPage from './info/InfoPage';

/** Each chapter of the story: an i18n key prefix, how many paragraphs it has and its photo. */
const CHAPTERS = [
  { key: 'about-app', paragraphs: 3, image: 'photo-combat-01.jpg', caption: 'about-app-image-text' },
  { key: 'about-before', paragraphs: 2, image: 'photo-chin-01.png', caption: 'about-before-image-text' },
  { key: 'about-now', paragraphs: 3, image: 'photo-preparing-game-01.png', caption: 'about-now-image-text' },
  { key: 'about-motivation', paragraphs: 3, image: 'photo-board-01.jpeg', caption: 'about-motivation-image-text' },
  { key: 'about-testing', paragraphs: 3, image: 'photo-combat-02.jpeg', caption: undefined },
];

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <InfoPage
      title={t('footer-about-me')}
      subtitle={t('about-intro-1')}
      image={0}
      actions={
        <Button variant="contained" startIcon={<MailOutlineIcon />} component={RouterLink} to="/contact">
          {t('about-contact-me')}
        </Button>
      }
    >
      <Typography variant="h6" component="p" sx={{ fontWeight: 400, maxWidth: 800, mb: { xs: 4, md: 7 } }}>
        {t('about-intro-2')}
      </Typography>
      <Stack spacing={{ xs: 5, md: 9 }}>
        {CHAPTERS.map((chapter, index) => (
          <Reveal key={chapter.key}>
            <Grid
              container
              spacing={{ xs: 2, md: 5 }}
              direction={{ xs: 'row', md: index % 2 === 0 ? 'row' : 'row-reverse' }}
              sx={{ alignItems: 'center' }}
            >
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  component="img"
                  src={`${imageBaseUrl}images/photos/${chapter.image}`}
                  alt=""
                  loading="lazy"
                  sx={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 2, boxShadow: 6 }}
                />
                {chapter.caption && (
                  <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1, fontStyle: 'italic' }}>
                    {t(chapter.caption)}
                  </Typography>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="h4" component="h2" sx={{ fontFamily: (theme) => theme.fonts.display, fontWeight: 600, mb: 1.5 }}>
                  {t(`${chapter.key}-title`)}
                </Typography>
                <Stack spacing={1.5} sx={{ color: 'text.secondary' }}>
                  {Array.from({ length: chapter.paragraphs }, (_, paragraph) => (
                    <Typography key={paragraph} variant="body1">
                      {chapter.key === 'about-app' && paragraph === 0 ? (
                        <Trans
                          i18nKey="about-app-text-1"
                          components={{
                            link: <Link href="https://ironcrown.co.uk/rolemaster-fantasy-role-playing/" target="_blank" rel="noopener noreferrer" />,
                          }}
                        />
                      ) : (
                        t(`${chapter.key}-text-${paragraph + 1}`)
                      )}
                    </Typography>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Reveal>
        ))}
      </Stack>
    </InfoPage>
  );
}
