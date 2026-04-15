import React, { Fragment } from 'react';
import { Link } from '@mui/material';
import Alert from '@mui/material/Alert';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { imageBaseUrl } from '../../services/config';

const SECTIONS = [
  {
    link: '/core',
    title: 'Core',
    text: 'The core module provides the basic rules and mechanics for the game, including character creation, skill checks, and combat resolution. It serves as the foundation for the other modules and ensures a consistent gameplay experience.',
    image: `${imageBaseUrl}images/generic/configuration.png`,
  },
  {
    link: '/strategic',
    title: 'Strategic',
    text: 'The strategic module allows us to create a campaign (strategic game) set in a specific realm such as LOTR or Forgotten Realms. Each campaign has a set of factions that will be managed by one or more players. Each faction has a set of characters that we can manage from the application.',
    image: `${imageBaseUrl}images/generic/strategic.png`,
  },
  {
    link: '/tactical',
    title: 'Tactical',
    text: 'The tactical module allows us to select the factions that will interact, usually through combat. We can create a battle (tactical game) associated with a campaign and import the factions involved. Once the characters are loaded, we will have a dashboard where we can resolve the characters actions such as movement, combat, or maneuvers.',
    image: `${imageBaseUrl}images/generic/tactical.png`,
  },
  {
    link: '/npcs',
    title: 'NPCS',
    text: 'The NPC module allows us to manage different characters that are not created using the character creation system, such as animals, predefined characters with predetermined statistics and equipment, dragons, unicorns, and anything else we can think of.',
    image: `${imageBaseUrl}images/generic/npcs.png`,
  },
  {
    link: '/items',
    title: 'Items',
    text: 'The items module allows you to create both generic in-game items, such as a shield or a dagger, and items specific to a particular realm, such as the sword Narsil from The Lord of the Rings',
    image: `${imageBaseUrl}images/generic/npcs.png`,
  },
];

export const Home = () => {
  return (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>
        This application is an independent project developed by fans of Rolemaster Unified. It is not affiliated with, endorsed by, or licensed by
        Iron Crown Enterprises (ICE), the owners of the Rolemaster intellectual property. All Rolemaster trademarks, game systems, and materials are
        the property of Iron Crown Enterprises. This software is provided for personal, non-commercial use only. If you enjoy Rolemaster, please
        support the official publications and content from ICE.
      </Alert>
      <Typography variant="h4" color="primary" align="center" gutterBottom>
        RMU Engine
      </Typography>

      <Typography variant="body1" color="primary" gutterBottom>
        This application is an assistant for playing Rolemaster Unified. It supports character and campaign management as well as combat, maneuvers,
        and actions using the following rules:
      </Typography>
      <ul>
        <li>Core Law</li>
        <li>Creature Law</li>
        <li>Treasure Law</li>
      </ul>

      <Divider sx={{ my: 4 }} />

      {SECTIONS.map((section, index) => (
        <Fragment key={index}>
          <Grid size={5}>
            <CardMedia component="img" image={section.image} alt="Strategic module" sx={{ width: '100%', borderRadius: 2 }} />
          </Grid>
          <Grid size={7}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <Link href={section.link}>{section.title}</Link>
              </Typography>
              <Typography variant="body1">{section.text}</Typography>
            </CardContent>
          </Grid>
        </Fragment>
      ))}
    </>
  );
};

export default Home;
