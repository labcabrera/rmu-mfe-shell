import React from 'react';
import { useNavigate } from 'react-router-dom';
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
        <>
          <Typography variant="body1" sx={{ lineHeight: 1.9, color: 'text.secondary', fontSize: '1.5rem' }}>
            In 2021, I started developing an app for playing{' '}
            <Link href="https://ironcrown.co.uk/rolemaster-fantasy-role-playing/" target="_blank">
              RMSS
            </Link>{' '}
            for my own use, as a tool to streamline games. When the app was already quite far along, one afternoon whilst looking at my phone I
            discovered that a new version of Rolemaster was about to be released.
          </Typography>
          <Typography variant="body1" mt={2} sx={{ lineHeight: 1.9, color: 'text.secondary', fontSize: '1.5rem' }}>
            So I thought: it’s a bit of a cheek that, after two decades without any new content, they’ve had to release a version right now, just when
            I’d almost got all the features I wanted!!!
          </Typography>
          <Typography variant="body1" mt={2} sx={{ lineHeight: 1.9, color: 'text.secondary', fontSize: '1.5rem' }}>
            Then, during the 2025 holidays, I said to myself, Right, let’s start again, this time by creating a helper tool for the new system.
          </Typography>
        </>
      </>
    ),
    image: `${imageBaseUrl}images/photos/photo-combat-01.jpg`,
    imageText: "With all this programming, I haven't had time to paint lately!",
  },
  {
    title: 'Before',
    text: (
      <>
        <Typography variant="body1" sx={{ lineHeight: 1.9, color: 'text.secondary', fontSize: '1.5rem' }}>
          When I was very young, I started using spreadsheets to speed up games and create characters, because whilst doing it with pen and paper has
          its charm, it ends up being very time-consuming.
        </Typography>
        <Typography variant="body1" mt={2} sx={{ lineHeight: 1.9, color: 'text.secondary', fontSize: '1.5rem' }}>
          So, without any knowledge of programming, I began automating certain tasks, mainly the damage tables, so I wouldn’t have to keep looking up
          the row and column for the Arms Law of the time And those were my first steps in programming, a profession I’ve been working in for 20
          years.
        </Typography>
      </>
    ),
    image: `${imageBaseUrl}images/photos/photo-chin-01.png`,
    imageText: "I'm Chin, the Other assistant",
  },
  {
    title: 'Now',
    text: (
      <>
        <Typography variant="body1" sx={{ lineHeight: 1.9, color: 'text.secondary', fontSize: '1.5rem' }}>
          Now, after many years without playing and having passed my forties, I wanted to recapture those afternoons spent rolling open-ended dices
          and feel once more what it’s like when a level-one goblin has to roll the dice on the critical hit table.
        </Typography>
        <Typography variant="body1" mt={2} sx={{ lineHeight: 1.9, color: 'text.secondary', fontSize: '1.5rem' }}>
          Many of the adventures I prepared back then, with extensive maps and plenty of storytelling, ended with the main character sadly bleeding to
          death in the mud of a meadow after an encounter on the encounter table with a wild boar and her piglets.
        </Typography>
        <Typography variant="body1" mt={2} sx={{ lineHeight: 1.9, color: 'text.secondary', fontSize: '1.5rem' }}>
          That was one of the things I liked most about Rolemaster, its system suited less epic scenarios far better than other 80s role-playing
          games.
        </Typography>
      </>
    ),
    image: `${imageBaseUrl}images/photos/photo-preparing-game-01.png`,
    imageText: 'Preparing the board',
  },
  {
    title: 'Motivation',
    text: (
      <>
        <Typography variant="body1" sx={{ lineHeight: 1.9, color: 'text.secondary', fontSize: '1.5rem' }}>
          Although I used to play narrative campaigns as a child, the main focus of these was the combat, where you’d end up using miniatures as if it
          were a small-scale wargame. I’ve always enjoyed these games and have played quite a few of them, mainly 40k.
        </Typography>
        <Typography variant="body1" mt={2} sx={{ lineHeight: 1.9, color: 'text.secondary', fontSize: '1.5rem' }}>
          I liked gang management games in the style of Necromunda, where you had a small group of characters and simply faced off against another
          gang.
        </Typography>
        <Typography variant="body1" mt={2} sx={{ lineHeight: 1.9, color: 'text.secondary', fontSize: '1.5rem' }}>
          And I thought, this style of play, set in Middle-earth – which is by far the setting I’ve always liked best – using Rolemaster rules could
          work quite well.
        </Typography>
      </>
    ),
    image: `${imageBaseUrl}images/photos/photo-board-01.jpeg`,
    imageText: 'Amon Sûl surrounded by buildings? What happened?',
  },
  {
    title: 'Testing it on the board',
    text: (
      <>
        <Typography variant="body1" sx={{ lineHeight: 1.9, color: 'text.secondary', fontSize: '1.5rem' }}>
          After a few months of development, I finally enlisted my brother to test whether the project was actually feasible, or whether running a
          game with so many characters and rules would prove too complicated.
        </Typography>
        <Typography variant="body1" mt={2} sx={{ lineHeight: 1.9, color: 'text.secondary', fontSize: '1.5rem' }}>
          The idea was to use a tablet next to the table to work out movements, attacks, manoeuvres… whilst rolling the dice and taking measurements,
          checking the lines of sight on the table to see what cover an archer’s target would have…
        </Typography>
        <Typography variant="body1" mt={2} sx={{ lineHeight: 1.9, color: 'text.secondary', fontSize: '1.5rem' }}>
          And after several games, I’m happy with the result and I think it’s possible to combine the world of miniature skirmishes with the depth of
          rules that Rolemaster brings
        </Typography>
      </>
    ),
    image: `${imageBaseUrl}images/photos/photo-combat-02.jpeg`,
    imageText: '',
  },
];

export default function AboutPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        sx={{
          minHeight: '40vh',
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
            I’m someone who discovered Rolemaster and MERP in the early 90s and, after many years without playing, a bit of a midlife crisis has
            brought me back to this beloved game.
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600, mb: 3 }}>
            Now, 25 years on from those games I used to play with my brother, we’ve got together again to move around Lord of the Rings miniatures,
            eat pizza and roll the dice.
          </Typography>
          <Button variant="contained" color="secondary" onClick={() => navigate('/contact')}>
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
