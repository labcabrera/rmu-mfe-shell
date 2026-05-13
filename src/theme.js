import { alpha, createTheme } from '@mui/material/styles';

export const baseColors = {
  almostBlack: '#060707',
  darkSlate: '#282e2f',
  midSlate: '#495657',
  mist: '#617274',
  haze: '#99b3b6ff',
  dialogBackground: '#222626ff',
  dialogBackgroundTop: '#181818ff',
  backgroundDark: '#131414',
  surfaceLight: '#f7f9f9',
  paperLight: '#ffffff',
  textLight: '#253033',
  mutedLight: '#5d6c70',
  disabledLight: '#8b999c',
  success: '#a5d6a7',
  error: '#ffab91',
  warning: '#ebeb75ff',
  info: '#90caf9',
  scrollbarTrack: '#0f1115',
  scrollbarThumb: '#2a2f3a',
};

const palettes = {
  dark: {
    mode: 'dark',
    primary: {
      main: baseColors.haze,
      light: baseColors.haze,
      dark: baseColors.midSlate,
      contrastText: baseColors.almostBlack,
    },
    secondary: {
      main: baseColors.mist,
      light: baseColors.haze,
      dark: baseColors.midSlate,
      contrastText: baseColors.surfaceLight,
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
      disabled: baseColors.disabledLight,
    },
  },
  light: {
    mode: 'light',
    primary: {
      main: baseColors.midSlate,
      light: baseColors.mist,
      dark: baseColors.almostBlack,
      contrastText: baseColors.paperLight,
    },
    secondary: {
      main: baseColors.mist,
      light: baseColors.haze,
      dark: baseColors.midSlate,
      contrastText: baseColors.paperLight,
    },
    background: {
      default: baseColors.surfaceLight,
      light: baseColors.paperLight,
      paper: baseColors.paperLight,
    },
    divider: baseColors.haze,
    text: {
      primary: baseColors.textLight,
      secondary: baseColors.mutedLight,
      disabled: baseColors.disabledLight,
    },
  },
};

const createAppTheme = (mode = 'dark') => {
  const palette = palettes[mode] || palettes.dark;

  return createTheme({
    palette: {
      ...palette,
      success: { main: baseColors.success },
      error: { main: baseColors.error },
      warning: { main: baseColors.warning },
      info: { main: baseColors.info },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: 'sans-serif',
      fontSize: 16,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { scrollbarColor: `${baseColors.scrollbarThumb} ${baseColors.scrollbarTrack}` },
          '*::-webkit-scrollbar-thumb': { backgroundColor: baseColors.scrollbarThumb },
        },
      },
      MuiButton: {
        defaultProps: { size: 'small', variant: 'contained' },
        styleOverrides: {
          outlined: {
            color: palette.primary.main,
            backgroundColor: alpha(palette.primary.main, 0.06),
            border: `1px solid ${alpha(palette.primary.main, 0.18)}`,
            '&:hover': { backgroundColor: alpha(palette.primary.main, 0.12) },
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
            color: palette.primary.main,
            backgroundColor: alpha(palette.primary.main, 0.06),
            '&:hover': { backgroundColor: alpha(palette.primary.main, 0.12) },
            '&.Mui-selected': {
              color: palette.primary.contrastText,
              backgroundColor: palette.primary.main,
            },
            '&.Mui-selected:hover': {
              backgroundColor: palette.primary.dark,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? baseColors.dialogBackground : palette.background.paper,
            overflow: 'hidden',
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            background:
              mode === 'dark'
                ? `linear-gradient(180deg, ${baseColors.dialogBackgroundTop} 0%, ${baseColors.dialogBackground} 100%)`
                : palette.background.paper,
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            background:
              mode === 'dark'
                ? `linear-gradient(180deg, ${baseColors.dialogBackground} 0%, ${baseColors.dialogBackgroundTop} 100%)`
                : palette.background.paper,
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? baseColors.dialogBackground : palette.background.paper,
          },
        },
      },
    },
  });
};

export default createAppTheme;
