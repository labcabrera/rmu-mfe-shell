import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Paper, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import LegalInfoList from '../components/general/LegalInfo';
import { imageBaseUrl } from '../services/config';

const items = [
  { title: 'privacy-introduction-title', description: 'privacy-introduction-description' },
  { title: 'privacy-data-collection-title', description: 'privacy-data-collection-description' },
  { title: 'privacy-cookies-title', description: 'privacy-cookies-description' },
  { title: 'privacy-third-party-services-title', description: 'privacy-third-party-services-description' },
  { title: 'privacy-data-storage-title', description: 'privacy-data-storage-description' },
  { title: 'privacy-user-rights-title', description: 'privacy-user-rights-description' },
  { title: 'privacy-security-title', description: 'privacy-security-description' },
  { title: 'privacy-changes-title', description: 'privacy-changes-description' },
  { title: 'privacy-contact-title', description: 'privacy-contact-description' },
];

export default function PrivacyPolicyPage() {
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
            {t('footer-privacy-policy')}
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 6, fontSize: '1.3rem', lineHeight: 1.6 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <LegalInfoList items={items.map((item) => ({ title: t(item.title), description: t(item.description) }))} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
            {t('legal-concerns-contact')}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
