import React, { useEffect, useState } from 'react';
import { Link, Button, Container } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { imageBaseUrl } from '../../services/config';

export const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll('.feature-card');
    if (!cards) return;
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const ratio = Math.min(Math.max(entry.intersectionRatio, 0), 1);
          const scale = 1 + ratio * 0.2;
          el.style.transform = `scale(${scale})`;
          el.style.transition = 'transform 320ms cubic-bezier(.2,.9,.2,1), box-shadow 320ms cubic-bezier(.2,.9,.2,1)';
          el.style.zIndex = ratio > 0.45 ? '2' : '1';
          el.style.boxShadow = ratio > 0.35 ? '0 18px 40px rgba(2,6,23,0.16)' : '';
        });
      },
      { threshold: thresholds }
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  const features = [
    {
      title: 'Core',
      desc: 'Adjust game settings such as the creation of realms, races and professions, and define the general game configuration.',
      img: `${imageBaseUrl}images/generic/core.png`,
      href: '/core',
    },
    {
      title: 'Strategic',
      desc: 'The strategic module allows us to create a campaign (strategic game) set in a specific realm such as LOTR or Forgotten Realms. Each campaign has a set of factions that will be managed by one or more players. Each faction has a set of characters that we can manage from the application.',
      img: `${imageBaseUrl}images/generic/strategic.png`,
      href: '/strategic',
    },
    {
      title: 'Tactical',
      desc: 'Handle battles, characters and maneuvers in the tactical view.',
      img: `${imageBaseUrl}images/generic/tactical.png`,
      href: '/tactical',
    },
    {
      title: 'NPCs',
      desc: 'Predefined characters and creatures for quick scenarios.',
      img: `${imageBaseUrl}images/generic/npcs.png`,
      href: '/npcs',
    },
    {
      title: 'Spells',
      desc: 'Manage spells lists or create your own.',
      img: `${imageBaseUrl}images/generic/spells.png`,
      href: '/npcs',
    },
  ];

  return (
    <Box sx={{ width: '100%', bgcolor: (t) => t.palette.background.default, minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          This application is an independent project developed by fans of Rolemaster Unified. It is not affiliated with, endorsed by, or licensed by
          Iron Crown Enterprises (ICE). Please support official publications if you enjoy Rolemaster.
        </Alert>

        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }} color="primary">
              Modern companion for Rolemaster Unified
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Create campaigns, manage factions, resolve tactical combats and keep your sessions organized with a clean, extendable toolset.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button variant="contained" color="primary" href="/create">
                Start a campaign
              </Button>
              <Button variant="outlined" color="primary" href="/docs">
                Read the docs
              </Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
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

        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Core Features
        </Typography>

        <Grid container spacing={8}>
          {features.map((f) => (
            <Grid size={{ xs: 12, md: 12 }} mt={5} key={f.title}>
              <Card
                className="feature-card"
                onClick={() => window.location.assign(f.href)}
                onKeyDown={(e) => {
                  if ((e as unknown as KeyboardEvent).key === 'Enter') window.location.assign(f.href);
                }}
                role="button"
                tabIndex={0}
                sx={{
                  display: 'flex',
                  gap: 3,
                  alignItems: 'center',
                  p: 4,
                  transform: 'scale(1)',
                  minHeight: 220,
                  transition: 'transform 260ms ease-out, box-shadow 260ms ease-out',
                  cursor: 'pointer',
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h5">{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {f.desc}
                  </Typography>
                </CardContent>
                <Box sx={{ ml: 'auto', display: { xs: 'none', md: 'block' } }}>
                  <CardMedia component="img" image={f.img} alt={f.title} sx={{ width: 300, borderRadius: 1 }} />
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
