import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Card, CardActionArea, Chip, Stack, Typography } from '@mui/material';
import { enterSx, hoverLiftSx } from '@labcabrera-rmu/rmu-react-shared-lib';
import { LandingModule } from '../modules';

/** Clamps a text to `lines` lines. */
const clamp = (lines: number) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
});

/**
 * A module of the app as a tile: the illustration on top from `sm` (3:2), and a compact row with a square image on a
 * phone. The whole tile is a link (a real anchor: it opens in a new tab with a middle click).
 */
export const ModuleCard: FC<{ module: LandingModule; index: number; counter?: string }> = ({ module, index, counter }) => {
  const { t } = useTranslation();
  const Icon = module.icon;
  return (
    <Card variant="outlined" sx={[{ height: '100%' }, hoverLiftSx, enterSx(index)]}>
      <CardActionArea
        component={RouterLink}
        to={module.href}
        sx={{ height: '100%', display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: 'stretch' }}
      >
        <Box
          component="img"
          src={module.img}
          alt=""
          sx={{
            width: { xs: 96, sm: '100%' },
            height: { xs: 96, sm: 'auto' },
            aspectRatio: { sm: '3 / 2' },
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
        <Stack spacing={0.75} sx={{ p: { xs: 1.5, sm: 2 }, flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Icon fontSize="small" color="primary" />
            <Typography variant="h6" sx={{ fontFamily: (theme) => theme.fonts.display, lineHeight: 1.2 }}>
              {t(module.id)}
            </Typography>
            {counter && <Chip size="small" label={counter} sx={{ ml: 'auto' }} />}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={clamp(3)}>
            {t(module.desc)}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

/**
 * A module as a bento tile: the illustration fills it, darkened at the bottom where the title and the description
 * sit. `large` tiles show more text. The image drifts a little on hover (only with a mouse).
 */
export const ModuleBento: FC<{ module: LandingModule; index: number; large?: boolean; counter?: string }> = ({ module, index, large, counter }) => {
  const { t } = useTranslation();
  const Icon = module.icon;
  return (
    <Card sx={[{ height: '100%', position: 'relative' }, enterSx(index)]}>
      <CardActionArea
        component={RouterLink}
        to={module.href}
        sx={{
          height: '100%',
          minHeight: { xs: 128, md: large ? 320 : 150 },
          display: 'flex',
          alignItems: 'flex-end',
          '& .bento-image': { transition: 'transform 600ms ease-out' },
          '@media (hover: hover)': { '&:hover .bento-image': { transform: 'scale(1.06)' } },
        }}
      >
        <Box
          className="bento-image"
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${module.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10,8,6,0.92) 0%, rgba(10,8,6,0.55) 45%, rgba(10,8,6,0.05) 100%)',
          }}
        />
        <Stack spacing={0.5} sx={{ position: 'relative', p: { xs: 1.5, md: 2.5 }, width: '100%', color: 'common.white' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Icon fontSize="small" />
            <Typography variant={large ? 'h4' : 'h6'} sx={{ fontFamily: (theme) => theme.fonts.display, lineHeight: 1.15 }}>
              {t(module.id)}
            </Typography>
            <ArrowForwardIcon fontSize="small" sx={{ ml: 'auto', opacity: 0.8 }} />
          </Stack>
          {counter && (
            <Chip size="small" label={counter} sx={{ alignSelf: 'flex-start', bgcolor: 'rgba(255,255,255,0.16)', color: 'common.white' }} />
          )}
          <Typography variant="body2" sx={{ opacity: 0.85, ...clamp(large ? 3 : 2), display: { xs: 'none', sm: '-webkit-box' } }}>
            {t(module.desc)}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
};
