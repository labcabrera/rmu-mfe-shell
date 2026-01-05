import { createTheme, alpha } from '@mui/material/styles';

const baseColors = {
  almostBlack: '#060707',
  darkSlate: '#282e2f',
  midSlate: '#495657',
  mist: '#617274',
  haze: '#99b3b6ff',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: baseColors.haze,
      light: '#a8b3b4',
      dark: baseColors.midSlate,
      contrastText: '#050505',
    },
    secondary: {
      main: baseColors.mist,
      light: baseColors.haze,
      dark: baseColors.midSlate,
      contrastText: '#f3f5f5',
    },
    background: {
      default: baseColors.almostBlack,
      light: baseColors.darkSlate,
      paper: '#171a1b',
    },
    divider: baseColors.darkSlate,
    text: {
      primary: baseColors.haze,
      secondary: baseColors.mist,
      disabled: '#6f7a7c',
    },
    success: {
      main: '#a5d6a7',
    },
    error: {
      main: '#ffab91',
    },
    // Warning: ligero, tomando referencia entre error (rojo) y success (verde)
    warning: {
      main: '#e6dbb3ff',
    },
    info: {
      main: '#90caf9',
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
    MuiButton: {
      defaultProps: { size: 'small', variant: 'contained' },
      styleOverrides: {
        outlined: {
          color: baseColors.haze,
          backgroundColor: alpha(baseColors.haze, 0.06),
          border: `1px solid ${alpha(baseColors.haze, 0.18)}`,
          '&:hover': { backgroundColor: alpha(baseColors.haze, 0.12) },
        },
      },
    },
    MuiTextField: { defaultProps: { size: 'small', margin: 'dense', variant: 'standard' } },
    MuiSelect: { defaultProps: { size: 'small' } },
    MuiPaper: { styleOverrides: { root: { backdropFilter: 'saturate(120%) blur(4px)' } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiToggleButton: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          borderRadius: 8,
          color: baseColors.haze,
          backgroundColor: alpha(baseColors.haze, 0.06),
          '&:hover': { backgroundColor: alpha(baseColors.haze, 0.12) },
          '&.Mui-selected': {
            color: baseColors.almostBlack,
            backgroundColor: baseColors.haze,
          },
          '&.Mui-selected:hover': {
            backgroundColor: baseColors.midSlate,
          },
        },
      },
    },
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
