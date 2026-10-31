import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { imageBaseUrl } from '../services/config';

export default function RegisterPage() {
  const { t } = useTranslation();
  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        sx={{
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.2)), url(${imageBaseUrl}images/backgrounds/scene-02.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
            {t('register-title')}
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }} color="error">
            {t('register-not-available')}
          </Typography>
          <Typography variant="body1" color="primary" sx={{ maxWidth: 600, mb: 3 }}>
            {t('register-text-1')}
          </Typography>
          <Typography variant="body1" color="primary" sx={{ maxWidth: 600, mb: 3 }}>
            {t('register-text-2')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ py: 6 }}></Container>
    </Box>
  );
}
