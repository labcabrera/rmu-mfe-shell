import React, { JSX } from 'react';
import { Container, Divider, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { imageBaseUrl } from '../services/config';

export default function DocsPage(): JSX.Element {
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
            Get started
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }}>
            This section covers the first steps for using the tool, creating a campaign, developing characters and setting up a game.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          First of all, you’ll need the{' '}
          <Link href="https://www.drivethrurpg.com/en/browse?keyword=rolemaster" target="_blank">
            official ICE content
          </Link>{' '}
          to play! This tool is a guide that doesn’t cover the entire game. It simply helps to streamline certain actions, such as character
          management and combat management.
        </Typography>
        <Box
          component="img"
          src={`${imageBaseUrl}images/doc/ice-books.png`}
          alt="ICE books"
          sx={{
            width: { xs: '100%', sm: '80%', md: '40%' },
            display: 'block',
            mx: 'auto',
            objectFit: 'cover',
            borderRadius: 4,
            boxShadow: 4,
          }}
        />
        <Typography variant="body1" sx={{ mb: 3 }}>
          To use this assistant you should own the official rulebooks. These are available on DriveThruRPG, where you can find the full rules and game
          content. This assistant does not cover every option in the rules; it is intended as a practical tool to help manage characters and sessions.
        </Typography>

        <Divider />

        <Typography variant="h6" sx={{ maxWidth: 600, mb: 2 }}>
          Approach
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Assuming familiarity with Rolemaster concepts, the application focuses on the following core ideas:
        </Typography>

        <Box component="ul" sx={{ pl: 2, mb: 3, '& li': { mb: 1.5 } }}>
          <li>
            <Typography component="span">
              <strong>Realms</strong>: A realm defines the fictional universe for a campaign. This could be, for example, Shadow World, the official
              ICE universe, a realistic medieval setting without magic or Tolkien’s Middle-earth
            </Typography>
          </li>

          <li>
            <Typography component="span">
              <strong>Strategic game</strong>: Equivalent to a campaign. It contains factions, groups, and the collection of characters and resources
              that make up a long-running campaign.
            </Typography>
          </li>

          <li>
            <Typography component="span">
              <strong>Faction</strong>: A faction is a group of characters tied to a campaign. It can also represent a set of NPCs (for example, the
              goblins guarding a dungeon).
            </Typography>
          </li>

          <li>
            <Typography component="span">
              <strong>Character</strong>: A player character built using RMU design rules — attributes, skills, items and other customisations.
            </Typography>
          </li>

          <li>
            <Typography component="span">
              <strong>NPC</strong>: A non-player actor created either manually or derived from module content. NPCs are assigned levels, skills,
              equipment and hit points directly rather than through character construction rules.
            </Typography>
          </li>

          <li>
            <Typography component="span">
              <strong>Tactical game</strong>: Encounters and sessions that generally involve actions and combat, played with a board and miniatures.
              From the tactical dashboard you declare and resolve maneuvers, movement, combat, resistance rolls and other actions.
            </Typography>
          </li>
        </Box>

        <Box
          component="img"
          src={`${imageBaseUrl}images/doc/rmu-diagram.png`}
          alt="Diagram"
          sx={{
            width: { xs: '100%', sm: '90%', md: '60%' },
            display: 'block',
            mx: 'auto',
            objectFit: 'cover',
            borderRadius: 4,
            boxShadow: 4,
          }}
        />

        <Divider />

        <Typography variant="h6" sx={{ maxWidth: 600, mb: 2 }}>
          Creating a game
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          First, you must choose a Realm. You can use the default realms available in the app or create a new one. Creating a realm takes some time,
          as it involves setting up each of the races and customisations for that realm.
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Once inside the realm, you will create a ‘Strategic game’. Within the game, we’ll select certain features such as the experience multiplier
          and the board scale (which we’ll use to adapt the distances calculated by the app to our scale for playing with miniatures. For example, for
          28mm miniatures, we can choose a scale of 0.5 to play in inches on a standard wargame board).
        </Typography>
      </Container>
    </Box>
  );
}
