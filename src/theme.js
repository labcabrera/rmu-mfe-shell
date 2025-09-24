import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d3bb90',
    },
    secondary: {
      main: '#8b9395',
    },
    divider: '#a6bccf',
    background: {
      paper: '#212121',
    },
    success: {
      main: '#a5d6a7',
    },
    error: {
      main: '#ffab91',
    },
    info: {
      main: '#90caf9',
    },
    text: {
      disabled: '#969696ff',
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    //fontFamily: 'ringbearer, sans-serif',
    //fontFamily: 'Open Sans, sans-serif',
    fontFamily: 'sans-serif',
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
    MuiTextField: { defaultProps: { size: 'small', margin: 'dense', variant: 'standard' } },
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
