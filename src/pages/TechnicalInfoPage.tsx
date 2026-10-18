import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Container, Link, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { imageBaseUrl } from '../services/config';

export default function TechnicalInfoPage() {
  const { t } = useTranslation();
  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        sx={{
          minHeight: '25vh',
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
            {t('technical-title')}
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }}>
            {t('technical-intro')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            {t('technical-general-title')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('technical-prerequisites')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <Trans
              i18nKey="technical-architecture"
              components={{
                nestjs: <Link href="https://nestjs.com/" target="_blank" />,
                react: <Link href="https://es.react.dev/" target="_blank" />,
                mui: <Link href="https://mui.com/material-ui/getting-started/" />,
              }}
            />
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('technical-external-tools')}
          </Typography>
          <ul>
            <li>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Trans i18nKey="technical-tool-mongodb" components={{ link: <Link href="https://www.mongodb.com/" target="_blank" /> }} />
              </Typography>
            </li>
            <li>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Trans i18nKey="technical-tool-kafka" components={{ link: <Link href="https://kafka.apache.org/" target="_blank" /> }} />
              </Typography>
            </li>
            <li>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Trans i18nKey="technical-tool-keycloak" components={{ link: <Link href="https://www.keycloak.org/" /> }} />
              </Typography>
            </li>
          </ul>
          <Typography variant="h3" sx={{ mb: 2, mt: 6 }}>
            {t('technical-cloning-title')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <Trans
              i18nKey="technical-cloning-text-1"
              components={{ link: <Link href="https://github.com/labcabrera/rmu-platform" target="_blank" /> }}
            />
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('technical-cloning-text-2')}
          </Typography>
          <Typography variant="h3" sx={{ mb: 2, mt: 6 }}>
            {t('technical-running-title')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }} color="error">
            {t('technical-work-in-progress')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}></Typography>
        </Paper>
      </Container>
    </Box>
  );
}
