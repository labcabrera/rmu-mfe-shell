import { alpha, createTheme } from '@mui/material/styles';

export const baseColors = {
  scrollbarTrack: '#0f1115',
  scrollbarThumb: '#2a2f3a',
  dark: {
    almostBlack: '#060707',
    darkSlate: '#282e2f',
    midSlate: '#495657',
    mist: '#617274',
    haze: '#99b3b6ff',
    dialogBackground: '#222626ff',
    dialogBackgroundTop: '#181818ff',
    backgroundDark: '#131414',
    surfaceLight: '#f7f9f9',
    disabledLight: '#8b999c',
    success: '#a5d6a7',
    error: '#ffab91',
    warning: '#ebeb75ff',
    info: '#90caf9',
  },
  light: {
    almostBlack: '#060707',
    midSlate: '#495657',
    mist: '#617274',
    haze: '#99b3b6ff',
    surfaceLight: '#f7f9f9',
    paperLight: '#ffffff',
    textLight: '#253033',
    mutedLight: '#5d6c70',
    disabledLight: '#8b999c',
    success: '#51b256',
    error: '#f97249',
    warning: '#c8c830',
    info: '#64b5f6',
  },
};

const palettes = {
  dark: {
    mode: 'dark',
    primary: {
      main: baseColors.dark.haze,
      light: baseColors.dark.haze,
      dark: baseColors.dark.midSlate,
      contrastText: baseColors.dark.almostBlack,
    },
    secondary: {
      main: baseColors.dark.mist,
      light: baseColors.dark.haze,
      dark: baseColors.dark.midSlate,
      contrastText: baseColors.dark.surfaceLight,
    },
    background: {
      default: baseColors.dark.almostBlack,
      light: baseColors.dark.darkSlate,
      paper: baseColors.dark.backgroundDark,
    },
    divider: baseColors.dark.darkSlate,
    text: {
      primary: baseColors.dark.haze,
      secondary: baseColors.dark.mist,
      disabled: baseColors.dark.disabledLight,
    },
  },
  light: {
    mode: 'light',
    primary: {
      main: baseColors.light.midSlate,
      light: baseColors.light.mist,
      dark: baseColors.light.almostBlack,
      contrastText: baseColors.light.paperLight,
    },
    secondary: {
      main: baseColors.light.mist,
      light: baseColors.light.haze,
      dark: baseColors.light.midSlate,
      contrastText: baseColors.light.paperLight,
    },
    background: {
      default: baseColors.light.surfaceLight,
      light: baseColors.light.paperLight,
      paper: baseColors.light.paperLight,
    },
    divider: baseColors.light.haze,
    text: {
      primary: baseColors.light.textLight,
      secondary: baseColors.light.mutedLight,
      disabled: baseColors.light.disabledLight,
    },
  },
};

const createAppTheme = (mode = 'dark') => {
  const palette = palettes[mode] || palettes.dark;
  const colors = baseColors[mode] || baseColors.dark;

  return createTheme({
    palette: {
      ...palette,
      success: { main: colors.success },
      error: { main: colors.error },
      warning: { main: colors.warning },
      info: { main: colors.info },
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
            backgroundColor: mode === 'dark' ? baseColors.dark.dialogBackground : palette.background.paper,
            overflow: 'hidden',
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            background:
              mode === 'dark'
                ? `linear-gradient(180deg, ${baseColors.dark.dialogBackgroundTop} 0%, ${baseColors.dark.dialogBackground} 100%)`
                : palette.background.paper,
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            background:
              mode === 'dark'
                ? `linear-gradient(180deg, ${baseColors.dark.dialogBackground} 0%, ${baseColors.dark.dialogBackgroundTop} 100%)`
                : palette.background.paper,
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? baseColors.dark.dialogBackground : palette.background.paper,
          },
        },
      },
    },
  });
};

export default createAppTheme;
