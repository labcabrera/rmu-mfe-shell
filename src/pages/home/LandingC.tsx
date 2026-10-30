import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { heroImageOfVisit, LANDING_MODULES } from './modules';
import HeroPanorama from './parts/HeroPanorama';
import { DisclaimerNote, HeroActions, LandingTitle } from './parts/LandingParts';
import { ModuleBento } from './parts/ModuleTile';
import { LandingData } from './useLandingData';

/** Where each module sits in the bento: columns and rows it spans, per breakpoint (1, 2 and 4 columns). */
const PLACEMENT: Record<string, { sm: [number, number]; md: [number, number] }> = {
  tactical: { sm: [2, 2], md: [2, 2] },
  strategic: { sm: [2, 1], md: [2, 1] },
  core: { sm: [1, 1], md: [1, 1] },
  npcs: { sm: [1, 1], md: [1, 1] },
  items: { sm: [1, 1], md: [2, 1] },
  spells: { sm: [1, 1], md: [2, 1] },
};
const ORDER = ['tactical', 'strategic', 'core', 'npcs', 'items', 'spells'];

const span = ([columns, rows]: [number, number]) => `span ${rows} / span ${columns}`;

/**
 * Option C, "bento": a short hero and every module in one screen as a grid of illustrated tiles of different sizes,
 * with live counters when signed in.
 */
const LandingC: FC<{ data: LandingData }> = ({ data }) => {
  const { t } = useTranslation();
  const [image] = useState(heroImageOfVisit);
  const game = data.tacticalGames[0];
  const counters: Record<string, string | undefined> = data.signedIn
    ? {
        tactical: t('landing-count-games-in-progress', { count: data.counts.tactical }),
        strategic: t('landing-count-campaigns', { count: data.counts.strategic, characters: data.counts.characters }),
      }
    : {};
  const modules = ORDER.map((id) => LANDING_MODULES.find((module) => module.id === id)!);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <HeroPanorama start={image} minHeight={{ xs: 'auto', md: 260 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
          <Box sx={{ flex: 1 }}>
            <LandingTitle size="medium" />
            <Typography variant="body1" sx={{ maxWidth: 620, mt: 1.5, mb: 2.5, opacity: 0.9 }}>
              {t('shell.home.subtitle')}
            </Typography>
            <HeroActions signedIn={data.signedIn} />
          </Box>
          {game && (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<PlayArrowIcon />}
              component={RouterLink}
              to={`/tactical/combat/${game.id}`}
              sx={{ maxWidth: '100%' }}
            >
              <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t('landing-resume-game', { name: game.name, round: game.round })}
              </Box>
            </Button>
          )}
        </Stack>
      </HeroPanorama>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gridAutoRows: { xs: 'minmax(128px, auto)', md: 'minmax(170px, auto)' },
          }}
        >
          {modules.map((module, index) => (
            <Box key={module.id} sx={{ gridArea: { xs: 'auto', sm: span(PLACEMENT[module.id].sm), md: span(PLACEMENT[module.id].md) } }}>
              <ModuleBento module={module} index={index} large={module.id === 'tactical'} counter={counters[module.id]} />
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 3 }}>
          <DisclaimerNote />
        </Box>
      </Container>
    </Box>
  );
};

export default LandingC;
