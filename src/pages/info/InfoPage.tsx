import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material';
import HeroPanorama from '../home/parts/HeroPanorama';
import { Ornament } from '../home/parts/LandingParts';

export type InfoIndexEntry = { id: string; title: string };

/**
 * The frame of the pages linked from the footer (spec 053): a short illustrated header with the title in the display
 * font, then the content. With an `index`, the sections are listed at the side on wide screens and numbered.
 */
const InfoPage: FC<{
  title: string;
  subtitle?: ReactNode;
  /** Which illustration of the hero series. */
  image: number;
  actions?: ReactNode;
  /** Date of the last change of the text (legal pages), as YYYY-MM-DD. */
  updated?: string;
  index?: InfoIndexEntry[];
  children: ReactNode;
}> = ({ title, subtitle, image, actions, updated, index, children }) => {
  const { t, i18n } = useTranslation();
  const content = (
    <>
      {updated && (
        <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 3 }}>
          {t('info-updated', { date: new Date(updated).toLocaleDateString(i18n.language, { dateStyle: 'long' }) })}
        </Typography>
      )}
      {children}
    </>
  );

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <HeroPanorama start={image} minHeight={{ xs: 180, md: 240 }}>
        <Stack sx={{ maxWidth: 760 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontFamily: (theme) => theme.fonts.display,
              fontWeight: 600,
              fontSize: { xs: '2rem', md: '3rem' },
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </Typography>
          <Ornament />
          {subtitle && (
            <Typography variant="body1" component="div" sx={{ opacity: 0.92, fontSize: { md: '1.1rem' } }}>
              {subtitle}
            </Typography>
          )}
          {actions && <Box sx={{ mt: 2.5 }}>{actions}</Box>}
        </Stack>
      </HeroPanorama>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {index ? (
          <Grid container spacing={{ xs: 2, lg: 6 }}>
            <Grid size={{ lg: 3 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Stack component="nav" aria-label={title} spacing={1} sx={{ position: 'sticky', top: 96 }}>
                {index.map((entry, position) => (
                  <Link key={entry.id} href={`#${entry.id}`} underline="hover" color="text.secondary" variant="body2">
                    {`${position + 1}. ${entry.title}`}
                  </Link>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, lg: 9 }} sx={{ maxWidth: 800 }}>
              {content}
            </Grid>
          </Grid>
        ) : (
          content
        )}
      </Container>
    </Box>
  );
};

/** A section of an info page: a heading in the display font (numbered when `number` is given) and its text. */
export const InfoSection: FC<{ id: string; title: string; number?: number; children: ReactNode }> = ({ id, title, number, children }) => (
  <Box component="section" id={id} sx={{ scrollMarginTop: 96, mb: { xs: 4, md: 5 } }}>
    <Typography variant="h5" component="h2" sx={{ fontFamily: (theme) => theme.fonts.display, fontWeight: 600, mb: 1.5 }}>
      {number ? `${number}. ${title}` : title}
    </Typography>
    <Stack spacing={1.5} sx={{ color: 'text.secondary', '& strong': { color: 'text.primary' } }}>
      {children}
    </Stack>
  </Box>
);

/** A page made of numbered sections of plain text, each an i18n key pair `<key>-title` / `<key>-description`. */
export const ArticleInfoPage: FC<{ title: string; subtitle: string; image: number; updated: string; keys: string[]; footer?: ReactNode }> = ({
  title,
  subtitle,
  image,
  updated,
  keys,
  footer,
}) => {
  const { t } = useTranslation();
  const index = keys.map((key) => ({ id: key, title: t(`${key}-title`) }));
  return (
    <InfoPage title={title} subtitle={subtitle} image={image} updated={updated} index={index}>
      {keys.map((key, position) => (
        <InfoSection key={key} id={key} number={position + 1} title={t(`${key}-title`)}>
          <Typography variant="body1">{t(`${key}-description`)}</Typography>
        </InfoSection>
      ))}
      {footer}
    </InfoPage>
  );
};

export default InfoPage;
