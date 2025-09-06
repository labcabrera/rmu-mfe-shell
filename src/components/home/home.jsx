import React from "react";

import Typography from '@mui/material/Typography';
import { Card, CardContent, Link } from '@mui/material';

import "./home.css";

const Home = () => {
  return (
    <Card sx={{ maxWidth: 500, margin: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '20px' }}>
          This application offers a set of tools to
          play <Link href="http://ironcrown.co.uk/unified-rolemaster/" target="_blank" rel="noopener" color="primary">Rolemaster Unified</Link> developed
          by <Link href="https://ironcrown.co.uk/" target="_blank" rel="noopener" color="primary">Iron Crown Enterprises</Link>.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '20px' }}>
          This application is not an official product and requires the user to have the rulebooks as it is an assistant to speed up the games, especially oriented to combat.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          In the <Link href="/wiki" target="_blank" rel="noopener" color="primary">Wiki</Link> category you can find information to help you start your first campaign and set up the game.
        </Typography>
      </CardContent>
    </Card >
  );
};

export default Home;
