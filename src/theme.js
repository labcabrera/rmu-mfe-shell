import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark'
  },
  typography: {
    //fontFamily: 'ringbearer, sans-serif',
    fontSize: 26,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'ringbearer';
          src: url('/static/fonts/ringbearer.ttf') format('truetype');
        }
        body {
          font-family: 'ringbearer', sans-serif;
        }
      `,
    },
  },
});

export default theme;