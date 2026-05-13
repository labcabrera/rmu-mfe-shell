import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import LegalInfoList from '../components/general/LegalInfo';
import { imageBaseUrl } from '../services/config';

const items = [
  {
    title: 'Introduction',
    description: 'This application is designed to respect your privacy. It does not collect, store, or process personal data.',
  },
  {
    title: 'Data Collection',
    description:
      'No personal data is collected through this application. Users are not required to provide any personal information to use the service.',
  },
  {
    title: 'Cookies',
    description:
      'This application only uses strictly necessary technical cookies required for its operation. No tracking, analytics, or advertising cookies are used.',
  },
  {
    title: 'Third-Party Services',
    description: 'This application does not integrate third-party services that collect personal data, such as analytics or advertising platforms.',
  },
  {
    title: 'Data Storage',
    description: 'No personal data is stored on servers or shared with third parties.',
  },
  {
    title: 'User Rights',
    description: 'Since no personal data is collected or processed, there are no user data records to access, modify, or delete.',
  },
  {
    title: 'Security',
    description: 'Although no personal data is handled, reasonable measures are taken to ensure the integrity and security of the application.',
  },
  {
    title: 'Changes to This Policy',
    description: 'This privacy policy may be updated in the future. Any changes will be reflected on this page.',
  },
  {
    title: 'Contact',
    description: 'If you have any questions about this privacy policy, you may contact the project maintainers.',
  },
];

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 6, fontSize: '1.3rem', lineHeight: 1.6 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <LegalInfoList items={items} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
            If you have any legal concerns or questions about content, please contact the project maintainers via the repository.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
