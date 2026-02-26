import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', color: 'text.primary', py: 6, mt: 5 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
              Open source
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              This is a public open source project. The source code is available at{' '}
              <Link href="https://github.com/labcabrera/rmu-platform/" target="_blank" rel="noopener noreferrer">
                github.com/labcabrera/rmu-platform
              </Link>
              .
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 0.5 }}>
                  Official ICE
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  <li>
                    <Link href="https://ironcrown.co.uk/" sx={{ color: 'text.secondary' }}>
                      ICE
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.drivethrurpg.com/en/browse?keyword=rolemaster" sx={{ color: 'text.secondary' }}>
                      DriveThruRPG
                    </Link>
                  </li>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 0.5 }}>
                  Resources
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  <li>
                    <Link href="#" sx={{ color: 'text.secondary' }}>
                      Docs
                    </Link>
                  </li>
                  <li>
                    <Link href="#" sx={{ color: 'text.secondary' }}>
                      Guides
                    </Link>
                  </li>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 0.5 }}>
                  Company
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  <li>
                    <Link href="#" sx={{ color: 'text.secondary' }}>
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" sx={{ color: 'text.secondary' }}>
                      Contact
                    </Link>
                  </li>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 0.5 }}>
                  Legal
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  <li>
                    <Link href="#" sx={{ color: 'text.secondary' }}>
                      Privacy
                    </Link>
                  </li>
                </Box>
              </Grid>
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
            © {year} RMU — Public Project
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
