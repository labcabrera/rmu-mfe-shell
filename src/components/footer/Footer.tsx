import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Link, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

type FooterLink = { label: string; href: string; external?: boolean };

const sections: { title: string; links: FooterLink[] }[] = [
  {
    title: 'footer-project',
    links: [
      { label: 'footer-about-me', href: '/about' },
      { label: 'footer-get-started', href: '/docs' },
      { label: 'footer-technical', href: '/technical-info' },
      { label: 'Github', href: 'https://github.com/labcabrera/rmu-platform', external: true },
    ],
  },
  {
    title: 'footer-legal-group',
    links: [
      { label: 'footer-legal', href: '/legal' },
      { label: 'footer-privacy-policy', href: '/privacy-policy' },
      { label: 'footer-contact', href: '/contact' },
    ],
  },
  {
    title: 'footer-official-ice',
    links: [
      { label: 'ICE', href: 'https://ironcrown.co.uk/', external: true },
      { label: 'DriveThruRPG', href: 'https://www.drivethrurpg.com/en/browse?keyword=rolemaster', external: true },
      { label: 'ICE Discord', href: 'https://discord.com/invite/7fYkMHZ', external: true },
      { label: 'ICE Catalog', href: 'https://ironcrown.co.uk/catalog/', external: true },
    ],
  },
];

const FooterAnchor = ({ link, sx }: { link: FooterLink; sx?: object }) => {
  const { t } = useTranslation();
  const common = { color: 'text.secondary', ...sx };
  return link.external ? (
    <Link href={link.href} target="_blank" rel="noopener noreferrer" sx={common}>
      {link.label}
    </Link>
  ) : (
    <Link component={RouterLink} to={link.href} underline="hover" sx={common}>
      {t(link.label)}
    </Link>
  );
};

// Columns of links on tablets and desktops; on phones a short note and one wrapped row of links.
export default function Footer() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', color: 'text.primary', py: { xs: 2, sm: 6 }, mt: 1 }}>
      <Container maxWidth="lg">
        {isPhone ? (
          <Stack spacing={1}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('footer-on-development-short')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2 }}>
              {sections
                .flatMap((section) => section.links)
                .map((link) => (
                  <FooterAnchor
                    key={link.href}
                    link={link}
                    sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 44, typography: 'body2' }}
                  />
                ))}
            </Box>
          </Stack>
        ) : (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ color: 'text.primary', mb: 1, fontFamily: (theme) => theme.fonts.display }}>
                {t('footer-on-development')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('footer-on-development-text')} {/* eslint-disable-next-line i18next/no-literal-string -- URL shown as link text */}
                <Link href="https://github.com/labcabrera/rmu-platform/" target="_blank" rel="noopener noreferrer">
                  github.com/labcabrera/rmu-platform
                </Link>
                .
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={2}>
                {sections.map((section) => (
                  <Grid key={section.title} size={{ xs: 6, sm: 4 }}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 0.5 }}>
                      {t(section.title)}
                    </Typography>
                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, '& li': { mb: 1 } }}>
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <FooterAnchor link={link} />
                        </li>
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}
        <Box sx={{ borderTop: 1, borderColor: 'divider', mt: { xs: 2, sm: 4 }, pt: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {t('footer-copyright', { year })}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
