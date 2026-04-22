import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  const sections: {
    title: string;
    links: { label: string; href: string; openInNewTab?: boolean }[];
  }[] = [
    {
      title: 'Official ICE',
      links: [
        { label: 'ICE', href: 'https://ironcrown.co.uk/', openInNewTab: true },
        { label: 'DriveThruRPG', href: 'https://www.drivethrurpg.com/en/browse?keyword=rolemaster', openInNewTab: true },
        { label: 'ICE Discord', href: 'https://discord.com/invite/7fYkMHZ', openInNewTab: true },
        { label: 'ICE Catalog', href: 'https://ironcrown.co.uk/catalog/', openInNewTab: true },
      ],
    },
    {
      title: 'About',
      links: [
        { label: 'Legal', href: '/legal' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'About me', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Get started', href: '/docs' },
        { label: 'Github', href: 'https://github.com/labcabrera/rmu-platform', openInNewTab: true },
        { label: 'Technical', href: '/technical-info' },
      ],
    },
  ];

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', color: 'text.primary', py: 6, mt: 1 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
              On development
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              This application is currently under active development. Features may change, and you might encounter bugs or incomplete functionality.
              The project is fully open source, and we welcome feedback, contributions, and suggestions from the community. You can view the source
              code and follow the development progress here:{' '}
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
                    {section.title}
                  </Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, '& li': { mb: 1 } }}>
                    {section.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          sx={{ color: 'text.secondary' }}
                          {...(l.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            mt: 4,
            pt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            © {year} RMU Engine
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
