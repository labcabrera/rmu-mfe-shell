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
  shape: { borderRadius: 10 },
  typography: {
    //fontFamily: 'ringbearer, sans-serif',
    fontFamily: 'Open Sans, sans-serif',
    fontSize: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { scrollbarColor: '#2a2f3a #0f1115' },
        '*::-webkit-scrollbar-thumb': { backgroundColor: '#2a2f3a' },
      },
    },
    MuiButton: { defaultProps: { size: 'small', variant: 'contained' } },
    MuiTextField: { defaultProps: { size: 'small', margin: 'dense' } },
    MuiSelect: { defaultProps: { size: 'small' } },
    MuiPaper: { styleOverrides: { root: { backdropFilter: 'saturate(120%) blur(4px)' } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 8 } } },
  },
  // components: {
  //   Excluded_MuiCssBaseline: {
  //     styleOverrides: `
  //       @font-face {
  //         font-family: 'ringbearer';
  //         src: url('/static/fonts/anirm___.ttf') format('truetype');
  //       }
  //       body {
  //         font-family: 'ringbearer', sans-serif;
  //       }
  //     `,
  //   },
  // },
});

export default theme;