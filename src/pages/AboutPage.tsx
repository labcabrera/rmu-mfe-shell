import React from 'react';
import { Button, Container, Link } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { imageBaseUrl } from '../services/config';

const sections = [
  {
    title: 'This application',
    text: (
      <>
        <Typography variant="body1" sx={{ lineHeight: 1.9, color: 'text.secondary' }}>
          In 2021, I set about programming an initial version of the{' '}
          <Link href="https://ironcrown.co.uk/rolemaster-fantasy-role-playing/" target="_blank">
            RMSS
          </Link>{' '}
          based assistant. And just when I’d got the application quite far along, I discovered that a new version was due to be released soon. It’s a
          bit of a joke that, after decades without a new version, one was coming out just as I was finishing development. So I left the project on
          hold for a while until the new Rolemaster Unified books were published.
        </Typography>
      </>
    ),
    image: `${imageBaseUrl}images/photos/photo-combat-01.jpg`,
    imageText: "With all this programming, I haven't had time to paint lately!",
  },
  {
    title: 'What I Do',
    text: (
      <Typography variant="body1" sx={{ lineHeight: 1.9, color: 'text.secondary' }}>
        In 2021, I set about programming an initial version of the RMSS-based assistant. And just when I’d got the application quite far along, I
        discovered that a new version was due to be released soon. It’s a bit of a joke that, after decades without a new version, one was coming out
        just as I was finishing development. So I left the project on hold for a while until the new Rolemaster Unified books were published.
      </Typography>
    ),
    image: `${imageBaseUrl}images/photos/photo-chin-01.png`,
    imageText: "I'm Chin, the Other assistant",
  },
  {
    title: 'Beyond Work',
    text: (
      <Typography variant="body1" sx={{ lineHeight: 1.9, color: 'text.secondary' }}>
        In 2021, I set about programming an initial version of the RMSS-based assistant. And just when I’d got the application quite far along, I
        discovered that a new version was due to be released soon. It’s a bit of a joke that, after decades without a new version, one was coming out
        just as I was finishing development. So I left the project on hold for a while until the new Rolemaster Unified books were published.
      </Typography>
    ),
    image: `${imageBaseUrl}images/photos/photo-preparing-game-01.png`,
    imageText: 'Preparing the board',
  },
  {
    title: 'Beyond Work',
    text: (
      <Typography variant="body1" sx={{ lineHeight: 1.9, color: 'text.secondary' }}>
        In 2021, I set about programming an initial version of the RMSS-based assistant. And just when I’d got the application quite far along, I
        discovered that a new version was due to be released soon. It’s a bit of a joke that, after decades without a new version, one was coming out
        just as I was finishing development. So I left the project on hold for a while until the new Rolemaster Unified books were published.
      </Typography>
    ),
    image: `${imageBaseUrl}images/photos/photo-board-01.jpeg`,
    imageText: 'Amon Sûl surrounded by buildings? What happened?',
  },
  {
    title: 'Beyond Work',
    text: (
      <Typography variant="body1" sx={{ lineHeight: 1.9, color: 'text.secondary' }}>
        In 2021, I set about programming an initial version of the RMSS-based assistant. And just when I’d got the application quite far along, I
        discovered that a new version was due to be released soon. It’s a bit of a joke that, after decades without a new version, one was coming out
        just as I was finishing development. So I left the project on hold for a while until the new Rolemaster Unified books were published.
      </Typography>
    ),
    image: `${imageBaseUrl}images/photos/photo-combat-02.jpeg`,
    imageText: '',
  },
];
export default function AboutPage() {
  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.2)), url(${imageBaseUrl}images/actions/action-melee-all.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight={700} gutterBottom>
            About Me
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }}>
            I’m a gamer from Spain who discovered Rolemaster and MERP in the early 90s and hadn’t played the game for 25 years. During that time, I
            have played various board games, wargames and a few short narrative campaigns.
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }}>
            Now, as I’m getting on in years, I wanted to revisit those childhood games with my younger brother, and as playing Rolemaster without any
            assistantis quite complicated, I’ve decided to create one.
          </Typography>
          <Button variant="contained" color="secondary">
            Contact me
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {sections.map((section, index) => {
          const isReversed = index % 2 === 1;

          return (
            <Grid
              container
              spacing={6}
              key={section.title}
              sx={{ mb: 10 }}
              direction={{ xs: 'column-reverse', md: isReversed ? 'row-reverse' : 'row' }}
              alignItems="center"
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  component="img"
                  src={section.image}
                  alt={section.title}
                  sx={{
                    width: '100%',
                    height: { xs: 280, md: 420 },
                    objectFit: 'cover',
                    borderRadius: 4,
                    boxShadow: 4,
                  }}
                />
                <Typography variant="body1" color="secondary" mt={1}>
                  <em>{section.imageText}</em>
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {section.title}
                </Typography>
                {section.text}
              </Grid>
            </Grid>
          );
        })}
      </Container>
    </Box>
  );
}
