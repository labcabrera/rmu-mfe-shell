import { createTheme } from '@mui/material/styles';

const theme = createTheme({
 palette: {
    mode: 'dark',
    primary: {
      main: '#a5d6a7',
    },
    secondary: {
      main: '#a5d6a7',
    },
    divider: '#a5d6a7',
    background: {
      paper: '#212121',
    },
    error: {
      main: '#e57373',
    },
    text: {
      disabled: '#616161',
    },
  },
  typography: {
    //fontFamily: 'ringbearer, sans-serif',
    fontFamily: 'Open Sans, sans-serif',
    fontSize: 16,
  },
  components: {
    Excluded_MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'ringbearer';
          src: url('/static/fonts/anirm___.ttf') format('truetype');
        }
        body {
          font-family: 'ringbearer', sans-serif;
        }
      `,
    },
  },
});

export default theme;