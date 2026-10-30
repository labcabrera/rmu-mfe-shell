import React, { JSX } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, Card, CardActionArea, Grid, Link, Stack, Typography } from '@mui/material';
import { imageBaseUrl } from '../services/config';
import { LANDING_MODULES } from './home/modules';
import InfoPage, { InfoSection } from './info/InfoPage';

const CONCEPTS = [
  'docs-concept-realm',
  'docs-concept-strategic-game',
  'docs-concept-faction',
  'docs-concept-character',
  'docs-concept-npc',
  'docs-concept-tactical-game',
  'docs-concept-items',
  'docs-concept-spells',
];
const STEPS = ['docs-step-realm', 'docs-step-campaign', 'docs-step-characters', 'docs-step-tactical'];
const SECTIONS = ['docs-official', 'docs-modules', 'docs-approach', 'docs-first-steps'];

export default function DocsPage(): JSX.Element {
  const { t } = useTranslation();
  const strong = { strong: <strong /> };
  return (
    <InfoPage title={t('footer-get-started')} subtitle={t('docs-intro')} image={4} index={SECTIONS.map((id) => ({ id, title: t(`${id}-title`) }))}>
      <InfoSection id="docs-official" number={1} title={t('docs-official-title')}>
        <Typography variant="body1">
          <Trans
            i18nKey="docs-official-content-text"
            components={{ link: <Link href="https://www.drivethrurpg.com/en/browse?keyword=rolemaster" target="_blank" rel="noopener noreferrer" /> }}
          />
        </Typography>
        <Box
          component="img"
          src={`${imageBaseUrl}images/doc/ice-books.png`}
          alt={t('docs-ice-books-alt')}
          loading="lazy"
          sx={{ width: { xs: '100%', sm: 360 }, borderRadius: 2, boxShadow: 4, alignSelf: 'center' }}
        />
        <Typography variant="body1">{t('docs-rulebooks-text')}</Typography>
      </InfoSection>

      <InfoSection id="docs-modules" number={2} title={t('docs-modules-title')}>
        <Grid container spacing={1.5}>
          {LANDING_MODULES.map((module) => (
            <Grid key={module.id} size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardActionArea
                  component={RouterLink}
                  to={module.href}
                  sx={{ height: '100%', p: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}
                >
                  <Avatar variant="rounded" src={module.img} alt="" sx={{ width: 56, height: 56 }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontFamily: (theme) => theme.fonts.display, fontWeight: 600, color: 'text.primary' }}>
                      {t(module.id)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {t(module.desc)}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </InfoSection>

      <InfoSection id="docs-approach" number={3} title={t('docs-approach-title')}>
        <Typography variant="body1">{t('docs-approach-text')}</Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, '& li': { mb: 1 } }}>
          {CONCEPTS.map((key) => (
            <Typography key={key} component="li" variant="body1">
              <Trans i18nKey={key} components={strong} />
            </Typography>
          ))}
        </Box>
      </InfoSection>

      <InfoSection id="docs-first-steps" number={4} title={t('docs-first-steps-title')}>
        <Stack component="ol" spacing={1.5} sx={{ m: 0, pl: 3 }}>
          {STEPS.map((key) => (
            <Typography key={key} component="li" variant="body1">
              <Trans i18nKey={key} components={strong} />
            </Typography>
          ))}
        </Stack>
      </InfoSection>
    </InfoPage>
  );
}
