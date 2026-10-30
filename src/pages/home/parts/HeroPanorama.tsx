import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { HERO_IMAGES } from '../modules';

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/**
 * The hero background: the illustrations of the series stacked, the current one visible. With `rotateMs` they
 * cross-fade (not with reduced motion). The figures stand on the right, so the gradient darkens the left for the text.
 */
const HeroPanorama: FC<{
  start: number;
  rotateMs?: number;
  /** Per breakpoint, as `sx` takes it. */
  minHeight: { xs: string | number; md: string | number };
  children: ReactNode;
}> = ({ start, rotateMs, minHeight, children }) => {
  const [current, setCurrent] = useState(start);

  useEffect(() => {
    if (!rotateMs || reducedMotion()) return;
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % HERO_IMAGES.length), rotateMs);
    return () => window.clearInterval(timer);
  }, [rotateMs]);

  // Only the current image and the next one are loaded, not the whole series
  const loaded = rotateMs ? [current, (current + 1) % HERO_IMAGES.length] : [current];

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        color: 'common.white',
        bgcolor: 'grey.900',
        minHeight,
      }}
    >
      {HERO_IMAGES.map((image, index) => (
        <Box
          key={image}
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: loaded.includes(index) ? `url(${image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: { xs: '70% center', md: 'center 40%' },
            opacity: index === current ? 1 : 0,
            transition: 'opacity 1600ms ease-in-out',
          }}
        />
      ))}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: {
            xs: 'linear-gradient(to top, rgba(8,10,14,0.92) 10%, rgba(8,10,14,0.45) 70%, rgba(8,10,14,0.25))',
            md: 'linear-gradient(to right, rgba(8,10,14,0.88) 0%, rgba(8,10,14,0.55) 45%, rgba(8,10,14,0.05) 80%)',
          },
        }}
      />
      <Container maxWidth="xl" sx={{ position: 'relative', py: { xs: 4, md: 6 } }}>
        {children}
      </Container>
    </Box>
  );
};

export default HeroPanorama;
