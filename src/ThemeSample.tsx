import React, { Suspense } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, CardActions, CardContent, CardHeader, Divider, IconButton, Paper, TextField, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Grid } from '@mui/system';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Home from './components/home/Home';
import theme from './theme';

const ThemeSample = () => {
  return (
    <Grid container direction="column" spacing={2}>
      <Grid size={12}>
        <Typography variant="h4" gutterBottom>
          H4 no color text.
        </Typography>
        <Typography variant="h4" gutterBottom color="primary">
          H4 primary text.
        </Typography>
        <Typography variant="h4" gutterBottom color="secondary">
          H4 secondary text.
        </Typography>
        <Typography variant="h6" gutterBottom>
          H6 no color text.
        </Typography>
        <Typography variant="h6" gutterBottom color="primary">
          H6 primary text.
        </Typography>
        <Typography variant="h6" gutterBottom color="secondary">
          H6 secondary text.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Body1 no color text.
        </Typography>
        <Typography variant="body1" gutterBottom color="primary">
          Body1 primary text.
        </Typography>
        <Typography variant="body1" gutterBottom color="secondary">
          Body1 secondary text.
        </Typography>
        <Typography variant="body1" gutterBottom color="disabled">
          Body1 disabled text.
        </Typography>
        <Typography variant="body1" gutterBottom color="warning">
          Body1 warning text.
        </Typography>
        <Typography variant="body1" gutterBottom color="error">
          Body1 error text.
        </Typography>
        <Typography variant="body1" gutterBottom color="info">
          Body1 info text.
        </Typography>
        <Typography variant="body1" gutterBottom color="success">
          Body1 success text.
        </Typography>
        <Typography variant="body2" gutterBottom>
          Body2 normal text.
        </Typography>
        <Typography variant="body2" gutterBottom color="primary">
          Body2 normal text.
        </Typography>
        <Typography variant="body2" gutterBottom color="secondary">
          Body2 normal text.
        </Typography>
      </Grid>
      <Grid size={12}>
        <IconButton>
          <AddCircleIcon />
        </IconButton>
        <IconButton color="primary">
          <AddCircleIcon />
        </IconButton>
        <IconButton color="secondary">
          <AddCircleIcon />
        </IconButton>
      </Grid>
      <Grid size={12}>
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <Button variant="contained">Default contained</Button>
          <Button variant="contained" color="primary">
            Primary contained
          </Button>
          <Button variant="contained" color="secondary">
            Secondary contained
          </Button>
        </Box>
      </Grid>
      <Grid size={12}>
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <Button variant="outlined">Default outlined</Button>
          <Button variant="outlined" color="primary">
            Primary outlined
          </Button>
          <Button variant="outlined" color="secondary">
            Secondary outlined
          </Button>
        </Box>
      </Grid>
      <Grid size={12}>
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <Button variant="text">Default text</Button>
          <Button variant="text" color="primary">
            Primary text
          </Button>
          <Button variant="text" color="secondary">
            Secondary text
          </Button>
        </Box>
      </Grid>
      <Grid size={12}>
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <TextField label="Outlined" value={'default'} variant="outlined" />
          <TextField label="Outlined disabled" value={'disabled'} variant="outlined" disabled />
          <TextField label="Outlined primary" value={'primary'} variant="outlined" color="primary" />
          <TextField label="Outlined secondary" value={'secondary'} variant="outlined" color="secondary" />
        </Box>
      </Grid>
      <Grid size={12}>
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <TextField label="Standard" value={'default'} variant="standard" />
          <TextField label="Standard disabled" value={'disabled'} variant="standard" disabled />
          <TextField label="Standard primary" value={'primary'} variant="standard" color="primary" />
          <TextField label="Standard secondary" value={'secondary'} variant="standard" color="secondary" />
        </Box>
      </Grid>
      <Grid size={12}>
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <TextField label="Filled" value={'default'} variant="filled" />
          <TextField label="Filled disabled" value={'disabled'} variant="filled" disabled />
          <TextField label="Filled primary" value={'primary'} variant="filled" color="primary" />
          <TextField label="Filled secondary" value={'secondary'} variant="filled" color="secondary" />
        </Box>
      </Grid>
      <Grid size={12}>
        <CardContent>
          <CardHeader title="Card Header" subheader="Card Subheader" />
          <CardContent>
            <Typography variant="body1" gutterBottom>
              This is an example of card content. The card header and subheader are displayed above this text.
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary">
              Primary Action
            </Button>
          </CardActions>
        </CardContent>
      </Grid>
      <Grid size={12}>
        <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            This is an example of content inside a Paper component. The Paper component provides a nice background and padding.
          </Typography>
        </Paper>
        <Paper elevation={9} sx={{ p: 2, mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            This is an example of content inside a Paper component. The Paper component provides a nice background and padding.
          </Typography>
        </Paper>
      </Grid>
      <Grid size={12}>
        <Typography variant="body1" gutterBottom fontFamily={'Open Sans'}>
          Sample font family Open Sans. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </Typography>
        <Typography variant="body1" gutterBottom fontFamily={'sans-serif'}>
          Sample font family sans-serif. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </Typography>
        <Typography variant="body1" gutterBottom fontFamily={'garamond'}>
          Sample font family garamond. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </Typography>
        <Typography variant="body1" gutterBottom fontFamily={'cursive'}>
          Sample font family cursive. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </Typography>
        <Typography variant="body1" gutterBottom fontFamily={'tahoma'}>
          Sample font family tahoma. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </Typography>
        <Typography variant="body1" gutterBottom fontFamily={'monaco'}>
          Sample font family monaco. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </Typography>
        <Typography variant="body1" gutterBottom fontFamily={'fantasy'}>
          Sample font family fantasy. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </Typography>
        <Divider />
      </Grid>
    </Grid>
  );
};

export default ThemeSample;
