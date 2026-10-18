import React, { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import LegalInfoList from '../components/general/LegalInfo';
import { imageBaseUrl } from '../services/config';

const items = [
  { title: 'legal-affiliation-title', description: 'legal-affiliation-description' },
  { title: 'legal-copyright-title', description: 'legal-copyright-description' },
  { title: 'legal-purpose-title', description: 'legal-purpose-description' },
  { title: 'legal-privacy-title', description: 'legal-privacy-description' },
  { title: 'legal-monetization-title', description: 'legal-monetization-description' },
  { title: 'legal-license-title', description: 'legal-license-description' },
  { title: 'legal-liability-title', description: 'legal-liability-description' },
];

export default function LegalPage(): JSX.Element {
  const { t } = useTranslation();
  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        sx={{
          minHeight: '20vh',
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
            {t('footer-legal')}
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 6, fontSize: '1.3rem', lineHeight: 1.6 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            {t('legal-information-title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            {t('legal-intro')}
          </Typography>
          <LegalInfoList items={items.map((item) => ({ title: t(item.title), description: t(item.description) }))} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
            {t('legal-concerns-contact')}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
