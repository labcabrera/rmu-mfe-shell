import React from 'react';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { imageBaseUrl } from '../services/config';

export default function DocsPage(): JSX.Element {
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
          <Typography variant="h2" fontWeight={700} gutterBottom>
            Get started
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }}>
            In progress.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ py: 6 }}></Container>
    </Box>
  );
}
