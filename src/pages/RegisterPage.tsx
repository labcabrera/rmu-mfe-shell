import React from 'react';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { imageBaseUrl } from '../services/config';

export default function RegisterPage() {
  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        sx={{
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.2)), url(${imageBaseUrl}images/actions/actor-effects.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Register
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }} color="error">
            Not available
          </Typography>
          <Typography variant="body1" color="primary" sx={{ maxWidth: 600, mb: 3 }}>
            As this application does not hold the rights to ICE or the Rolemaster Unified licences, registration is not permitted. You must have a
            valid user account that has been created beforehand in order to use this tool.
          </Typography>
          <Typography variant="body1" color="primary" sx={{ maxWidth: 600, mb: 3 }}>
            We apologise for the inconvenience and will endeavour to reach a partnership agreement with ICE regarding the use of the tool.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ py: 6 }}></Container>
    </Box>
  );
}
