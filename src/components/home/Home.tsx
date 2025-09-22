import React from 'react';
import { Link } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const Home = () => {
  return (
    <Card sx={{ maxWidth: 1000, margin: 'auto', mt: 5 }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 1, p: 2 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          This application is an independent project developed by fans of Rolemaster Unified. It is not affiliated with, endorsed by, or licensed by
          Iron Crown Enterprises (ICE), the owners of the Rolemaster intellectual property. All Rolemaster trademarks, game systems, and materials are
          the property of Iron Crown Enterprises. This software is provided for personal, non-commercial use only. If you enjoy Rolemaster, please
          support the official publications and content from ICE.
        </Alert>
        <Typography variant="h4" align="center" gutterBottom>
          RMU Engine
        </Typography>

        <Typography variant="body1" color="textSecondary" gutterBottom>
          This application is an assistant for playing Rolemaster Unified. It supports character and campaign management as well as combat, maneuvers,
          and actions using the following rules:
        </Typography>
        <ul>
          <li>Core Law</li>
          <li>Creature Law</li>
          <li>Treasure Law</li>
        </ul>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4} alignItems="center">
          <Grid size={5}>
            <CardMedia component="img" image="/static/images/generic/strategic.png" alt="Strategic module" sx={{ width: '100%', borderRadius: 2 }} />
          </Grid>
          <Grid size={7}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <Link href="/strategic">Strategic module</Link>
              </Typography>
              <Typography variant="body1">
                The strategic module allows us to create a campaign (strategic game) set in a specific realm such as LOTR or Forgotten Realms. Each
                campaign has a set of factions that will be managed by one or more players. Each faction has a set of characters that we can manage
                from the application.
              </Typography>
            </CardContent>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4} alignItems="center">
          <Grid size={7} order={{ xs: 2, md: 1 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <Link href="/tactical">Tactical module</Link>
              </Typography>
              <Typography variant="body1">
                The tactical module allows us to select the factions that will interact, usually through combat. We can create a battle (tactical
                game) associated with a campaign and import the factions involved. Once the characters are loaded, we will have a dashboard where we
                can resolve the characters' actions such as movement, combat, or maneuvers.
              </Typography>
            </CardContent>
          </Grid>
          <Grid size={5} order={{ xs: 1, md: 2 }}>
            <CardMedia component="img" image="/static/images/avatars/avatar-017.png" alt="Tactical module" sx={{ width: '100%', borderRadius: 2 }} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4} alignItems="center">
          <Grid size={5}>
            <CardMedia component="img" image="/static/images/generic/configuration.png" alt="Core module" sx={{ width: '100%', borderRadius: 2 }} />
          </Grid>
          <Grid size={7}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <Link href="/core">Core module</Link>
              </Typography>
              <Typography variant="body1">
                The core module provides the basic rules and mechanics for the game, including character creation, skill checks, and combat
                resolution. It serves as the foundation for the other modules and ensures a consistent gameplay experience.
              </Typography>
            </CardContent>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4} alignItems="center">
          <Grid size={7} order={{ xs: 2, md: 1 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <Link href="/npcs">NPC module</Link>
              </Typography>
              <Typography variant="body1">
                The NPC module allows us to manage different characters that are not created using the character creation system, such as animals,
                predefined characters with predetermined statistics and equipment, dragons, unicorns, and anything else we can think of.
              </Typography>
            </CardContent>
          </Grid>
          <Grid size={5} order={{ xs: 1, md: 2 }}>
            <CardMedia component="img" image="/static/images/generic/npcs.png" alt="NPC module" sx={{ width: '100%', borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default Home;
