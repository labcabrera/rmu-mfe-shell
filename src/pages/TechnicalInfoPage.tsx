import React from 'react';
import { Container, Link, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { imageBaseUrl } from '../services/config';

export default function TechnicalInfoPage() {
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
            Technical Information
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }}>
            This section explains the technical structure of the project for running it locally
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            General project information
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            This guide assumes you have a basic understanding of Docker, Git, Node.js and TypeScript. If you don’t, setting up the application may
            prove a little tricky
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            The application is built using a microservices and micro-frontend (MFE) architecture. APIs are built using{' '}
            <Link href="https://nestjs.com/" target="_blank">
              NestJS
            </Link>{' '}
            following a CQRS pattern. The front-end uses{' '}
            <Link href="https://es.react.dev/" target="_blank">
              React
            </Link>{' '}
            and <Link href="https://mui.com/material-ui/getting-started/">MUI</Link> for its UI components.
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            The application uses the following external tools, all of which are open-source:
          </Typography>
          <ul>
            <li>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Link href="https://www.mongodb.com/" target="_blank">
                  MongoDB
                </Link>
                : a NoSQL database for storing data.
              </Typography>
            </li>
            <li>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Link href="https://kafka.apache.org/" target="_blank">
                  Apache Kafka
                </Link>
                : used for asynchronous communication between modules.
              </Typography>
            </li>
            <li>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Link href="https://www.keycloak.org/">Keycloak</Link>: IdP for authentication.
              </Typography>
            </li>
          </ul>
          <Typography variant="h3" sx={{ mb: 2, mt: 6 }}>
            Cloning the repositories
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Within the{' '}
            <Link href="https://github.com/labcabrera/rmu-platform" target="_blank">
              GitHub project
            </Link>
            , we can see the set of repositories that make up the tool.
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            As it is developed in a modular way, we won’t need to clone all the repositories—for example, if we aren’t going to use the spells or NPC
            modules.
          </Typography>
          <Typography variant="h3" sx={{ mb: 2, mt: 6 }}>
            Running the images
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }} color="error">
            Work in progress
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}></Typography>
        </Paper>
      </Container>
    </Box>
  );
}
