import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark'
    },
    typography: {
        fontFamily: 'ringbearer, sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        @font-face {
          font-family: 'ringbearer';
          //TODO review webpack config
          //src: url('./assets/fonts/ringbearer.ttf') format('truetype');
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