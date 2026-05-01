import React, { JSX } from 'react';
import { Container, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import LegalInfoList from '../components/general/LegalInfo';
import { imageBaseUrl } from '../services/config';

const items = [
  {
    title: 'No affiliation',
    description: 'This project is not affiliated with, endorsed, or approved by Iron Crown Enterprises.',
  },
  {
    title: 'Copyright',
    description: 'Rolemaster is a registered trademark and property of its respective owners.',
  },
  {
    title: 'Purpose',
    description: 'This project is developed for recreational purposes by the community.',
  },
  {
    title: 'Privacy',
    description:
      'No personal data is collected, and no third-party cookies are used. Only strictly necessary technical cookies are employed for the proper functioning of the application.',
  },
  {
    title: 'Monetization',
    description:
      'This application is not intended to be monetized in any way. No revenue is generated through advertising, subscriptions, or any other form of commercial activity.',
  },
  {
    title: 'License',
    description: 'This project is open-source software distributed under the GPL-3.0 license.',
  },
  {
    title: 'Liability',
    description: 'Use of this tool is at the user’s own risk.',
  },
];

export default function LegalPage(): JSX.Element {
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
          <Typography variant="h2" fontWeight={700} gutterBottom>
            Legal
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 6, fontSize: '1.3rem', lineHeight: 1.6 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Legal Information
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Please review the following legal terms regarding the use of this application.
          </Typography>
          <LegalInfoList items={items} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
            If you have any legal concerns or questions about content, please contact the project maintainers via the repository.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
