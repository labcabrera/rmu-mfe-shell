import { createTheme, alpha } from '@mui/material/styles';

const baseColors = {
  almostBlack: '#060707',
  darkSlate: '#282e2f',
  midSlate: '#495657',
  mist: '#617274',
  haze: '#99b3b6ff',
  dialogBackground: '#222626ff',
  dialogBackgroundTop: '#181818ff',
  backgroundDark: '#131414',
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
      paper: baseColors.backgroundDark,
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
    warning: {
      main: '#ebeb75ff',
    },
    info: {
      main: '#90caf9',
    },
  },
  shape: { borderRadius: 10 },
  typography: {
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
    MuiTextField: { defaultProps: { size: 'small', margin: 'dense', variant: 'outlined' } },
    MuiSelect: { defaultProps: { size: 'small', margin: 'dense', variant: 'outlined' } },
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
          '&.Mui-disabled': {
            border: `1px solid ${alpha(baseColors.darkSlate, 0.36)}`,
            color: alpha(baseColors.mist, 0.9),
            backgroundColor: alpha(baseColors.haze, 0.03),
          },
          '&.Mui-disabled:hover': {
            backgroundColor: alpha(baseColors.darkSlate, 0.12),
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: baseColors.dialogBackground,
          overflow: 'hidden',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          background: `linear-gradient(180deg, ${baseColors.dialogBackgroundTop} 0%, ${baseColors.dialogBackground} 100%)`,
          padding: '16px 24px',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          background: `linear-gradient(180deg, ${baseColors.dialogBackground} 0%, ${baseColors.dialogBackgroundTop} 100%)`,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: baseColors.dialogBackground,
        },
      },
    },
  },
});

export default theme;
