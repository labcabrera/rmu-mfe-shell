import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
// From the package root: Module Federation shares '@mui/material' as a singleton but not its deep paths, and
// a ThemeProvider from another copy would not pass the theme's default props to the remotes' components.
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createAppTheme, parseThemeConfig, ThemeConfig } from '@labcabrera-rmu/rmu-react-shared-lib';

/** What the user picks. Unlike the theme config, the mode can follow the operating system. */
export type ThemeSettings = Omit<ThemeConfig, 'mode'> & { mode: ThemeConfig['mode'] | 'system' };

const STORAGE_KEY = 'rmuTheme';
/** Key used before presets existed: it only held the mode. */
const LEGACY_STORAGE_KEY = 'themeMode';

const readSettings = (): ThemeSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const mode = (JSON.parse(stored) as Partial<ThemeSettings>).mode;
      return { ...parseThemeConfig(stored), ...(mode === 'system' && { mode }) };
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy === 'system') return { ...parseThemeConfig(null), mode: 'system' };
    return parseThemeConfig(legacy);
  } catch {
    // Storage unavailable or a broken value: start from the default.
    return parseThemeConfig(null);
  }
};

const writeSettings = (settings: ThemeSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Storage unavailable (private mode, blocked site data): the choice is just not remembered.
  }
};

const systemMode = (): ThemeConfig['mode'] => {
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

type ThemeSettingsContextValue = {
  settings: ThemeSettings;
  updateSettings: (change: Partial<ThemeSettings>) => void;
};

const ThemeSettingsContext = createContext<ThemeSettingsContextValue | null>(null);

export const useThemeSettings = (): ThemeSettingsContextValue => {
  const context = useContext(ThemeSettingsContext);
  if (!context) throw new Error('useThemeSettings must be used inside ThemeSettingsProvider');
  return context;
};

/** Builds the app theme from the user's settings and provides both to the shell and the remotes. */
export const ThemeSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<ThemeSettings>(readSettings);
  const [resolvedSystemMode, setResolvedSystemMode] = useState(systemMode);

  // In "system" mode, follow the operating system when it switches between light and dark.
  useEffect(() => {
    if (settings.mode !== 'system') return;
    const query = window.matchMedia?.('(prefers-color-scheme: light)');
    const onChange = () => setResolvedSystemMode(systemMode());
    query?.addEventListener?.('change', onChange);
    return () => query?.removeEventListener?.('change', onChange);
  }, [settings.mode]);

  const updateSettings = useCallback((change: Partial<ThemeSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...change };
      writeSettings(next);
      return next;
    });
  }, []);

  const mode = settings.mode === 'system' ? resolvedSystemMode : settings.mode;
  const theme = useMemo(
    () => createAppTheme({ preset: settings.preset, density: settings.density, mode }),
    [settings.preset, settings.density, mode]
  );
  const value = useMemo(() => ({ settings, updateSettings }), [settings, updateSettings]);

  return (
    <ThemeSettingsContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeSettingsContext.Provider>
  );
};
