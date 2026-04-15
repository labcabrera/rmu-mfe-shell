import React, { useEffect, useState } from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import { Button, Container, useTheme, useMediaQuery, Link } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { imageBaseUrl } from '../../services/config';

const MODULES = [
  {
    title: 'Core',
    desc: 'Adjust game settings such as the creation of realms, races and professions, and define the general game configuration. You can use the standard RMU settings or create as many game-specific customisations as you like.',
    img: `${imageBaseUrl}images/generic/core.png`,
    href: '/core',
  },
  {
    title: 'Strategic',
    desc: 'Create a game with your friends using characters from a specific realm. The strategic mode allows you to create characters, equip them, and set the rules for the campaign you’ll be playing. Create your own factions and customise the characters who will be involved in future matches.',
    img: `${imageBaseUrl}images/generic/strategic.png`,
    href: '/strategic',
  },
  {
    title: 'Tactical',
    desc: 'Once you’ve created a campaign in tactical mode, you can battle against other players or the environment. Simply choose who’s taking part in the battle and roll the dice.',
    img: `${imageBaseUrl}images/generic/tactical.png`,
    href: '/tactical',
  },
  {
    title: 'NPCs',
    desc: "Use the game's NPCs or create your own. NPCs can range from a level-one sheep to a specific level-500 character. Good luck with it.",
    img: `${imageBaseUrl}images/generic/npcs.png`,
    href: '/npcs',
  },
  {
    title: 'Spells',
    desc: "Use the spells from the game's default spell lists or create your own spell lists.",
    img: `${imageBaseUrl}images/generic/spells.png`,
    href: '/npcs',
  },
];

export const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('lg'));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll('.feature-card')) as HTMLElement[];
    if (!cards || cards.length === 0) return;
    if (isSmall) {
      cards.forEach((el) => {
        el.style.transform = 'none';
        el.style.transition = '';
        el.style.zIndex = '1';
        el.style.boxShadow = '';
      });
      return;
    }

    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    const obs = new IntersectionObserver(
      () => {
        // On any intersection change, compute which card is closest to viewport center
        const viewportCenterY = window.innerHeight / 2;
        cards.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const elemCenterY = rect.top + rect.height / 2;
          const distance = Math.abs(elemCenterY - viewportCenterY);
          // maxDistance roughly half viewport plus element height to normalize
          const maxDistance = window.innerHeight / 2 + rect.height / 2;
          const normalized = Math.max(0, 1 - distance / maxDistance); // 1 => center, 0 => far
          // sharpen so center gains much more weight than neighbors
          const weight = Math.pow(normalized, 2.2);
          const multiplier = isSmall ? 0.12 : 0.28;
          const scale = 1 + weight * multiplier; // smaller multiplier on mobile
          el.style.transform = `scale(${scale})`;
          el.style.transition = 'transform 260ms cubic-bezier(.2,.9,.2,1), box-shadow 260ms cubic-bezier(.2,.9,.2,1)';
          el.style.zIndex = weight > 0.35 ? '2' : '1';
          el.style.boxShadow = weight > 0.35 ? '0 18px 40px rgba(2,6,23,0.16)' : '';
        });
      },
      { threshold: thresholds }
    );

    cards.forEach((c) => obs.observe(c));
    // initial compute to set styles immediately
    const tick = () => {
      const viewportCenterY = window.innerHeight / 2;
      cards.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elemCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(elemCenterY - viewportCenterY);
        const maxDistance = window.innerHeight / 2 + rect.height / 2;
        const normalized = Math.max(0, 1 - distance / maxDistance);
        const weight = Math.pow(normalized, 2.2);
        const multiplier = isSmall ? 0.12 : 0.28;
        const scale = 1 + weight * multiplier;
        el.style.transform = `scale(${scale})`;
        el.style.transition = 'transform 260ms cubic-bezier(.2,.9,.2,1), box-shadow 260ms cubic-bezier(.2,.9,.2,1)';
        el.style.zIndex = weight > 0.35 ? '2' : '1';
        el.style.boxShadow = weight > 0.35 ? '0 18px 40px rgba(2,6,23,0.16)' : '';
      });
    };
    tick();

    return () => obs.disconnect();
  }, [isSmall]);

  return (
    <Box sx={{ width: '100%', bgcolor: (t) => t.palette.background.default, minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          This application is an independent project developed by fans of Rolemaster Unified. It is not affiliated with, endorsed by, or licensed by{' '}
          <Link href="https://ironcrown.co.uk/">Iron Crown Enterprises (ICE)</Link>. Please support official publications if you enjoy Rolemaster.
        </Alert>

        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 12 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }} color="primary">
              Modern companion for Rolemaster Unified
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Create campaigns, manage factions, resolve tactical combats and keep your sessions organized with a clean, extendable toolset.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button variant="contained" color="primary" href="/strategic/games/create">
                Start a campaign
              </Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 10 }}>
            <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                image={`${imageBaseUrl}images/generic/strategic.png`}
                alt="hero"
                sx={{ width: '100%', height: 320, objectFit: 'cover' }}
              />
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        <Grid container spacing={3}>
          {MODULES.map((f) => (
            <Grid size={12} key={f.title} sx={{ mt: { xs: 3, md: 5 }, overflow: { xs: 'hidden', md: 'visible' } }}>
              <Card
                className="feature-card"
                onClick={() => window.location.assign(f.href)}
                onKeyDown={(e) => {
                  if ((e as any).key === 'Enter') window.location.assign(f.href);
                }}
                role="button"
                tabIndex={0}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3,
                  alignItems: 'center',
                  p: { xs: 2, md: 4 },
                  transform: 'scale(1)',
                  transformOrigin: 'center center',
                  width: '100%',
                  boxSizing: 'border-box',
                  minHeight: { xs: 'auto', md: 220 },
                  transition: 'transform 260ms ease-out, box-shadow 260ms ease-out',
                  cursor: 'pointer',
                }}
              >
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography variant="h5">{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {f.desc}
                  </Typography>
                </CardContent>
                <Box sx={{ ml: { xs: 0, md: 'auto' }, mt: { xs: 2, md: 0 }, width: { xs: '100%', md: 240 } }}>
                  <CardMedia
                    component="img"
                    image={f.img}
                    alt={f.title}
                    sx={{ width: '100%', height: { xs: 200, md: 160 }, objectFit: 'cover', borderRadius: 1 }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
