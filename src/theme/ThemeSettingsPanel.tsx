import React from 'react';
import { useTranslation } from 'react-i18next';
import ComputerIcon from '@mui/icons-material/Computer';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Box, ButtonBase, Stack, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material';
import { presetSwatch, ThemeDensity, themePresetNames } from '@labcabrera-rmu/rmu-react-shared-lib';
import { ThemeSettings, useThemeSettings } from './ThemeSettingsProvider';

const Label = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
    {children}
  </Typography>
);

/** Preset, mode and density controls. Used by the header theme selector and the user profile. */
const ThemeSettingsPanel = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { settings, updateSettings } = useThemeSettings();

  return (
    <Stack spacing={2}>
      <Box>
        <Label>{t('theme-preset')}</Label>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1 }}>
          {themePresetNames.map((preset) => {
            const swatch = presetSwatch(preset, theme.palette.mode);
            const selected = settings.preset === preset;
            return (
              <ButtonBase
                key={preset}
                onClick={() => updateSettings({ preset })}
                aria-pressed={selected}
                sx={{
                  display: 'block',
                  textAlign: 'left',
                  borderRadius: `${theme.radius.md}px`,
                  border: 2,
                  borderColor: selected ? 'primary.main' : 'divider',
                  overflow: 'hidden',
                  transition: theme.transitions.create('border-color'),
                }}
              >
                <Box sx={{ bgcolor: swatch.background, p: 1, display: 'flex', gap: 0.75, alignItems: 'center' }}>
                  <Box sx={{ flex: 1, height: 28, borderRadius: 1, bgcolor: swatch.paper }} />
                  <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: swatch.primary }} />
                  <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: swatch.secondary }} />
                </Box>
                <Typography variant="body2" sx={{ px: 1, py: 0.5, fontWeight: selected ? 700 : 500 }}>
                  {t(`theme-preset-${preset}`)}
                </Typography>
              </ButtonBase>
            );
          })}
        </Box>
      </Box>
      <Box>
        <Label>{t('theme')}</Label>
        <ToggleButtonGroup
          color="primary"
          exclusive
          fullWidth
          size="small"
          value={settings.mode}
          onChange={(_, mode: ThemeSettings['mode'] | null) => mode && updateSettings({ mode })}
        >
          <ToggleButton value="light">
            <LightModeIcon fontSize="small" sx={{ mr: 0.5 }} />
            {t('light')}
          </ToggleButton>
          <ToggleButton value="dark">
            <DarkModeIcon fontSize="small" sx={{ mr: 0.5 }} />
            {t('dark')}
          </ToggleButton>
          <ToggleButton value="system">
            <ComputerIcon fontSize="small" sx={{ mr: 0.5 }} />
            {t('system')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box>
        <Label>{t('density')}</Label>
        <ToggleButtonGroup
          color="primary"
          exclusive
          fullWidth
          size="small"
          value={settings.density}
          onChange={(_, density: ThemeDensity | null) => density && updateSettings({ density })}
        >
          <ToggleButton value="comfortable">
            <DensityMediumIcon fontSize="small" sx={{ mr: 0.5 }} />
            {t('density-comfortable')}
          </ToggleButton>
          <ToggleButton value="compact">
            <DensitySmallIcon fontSize="small" sx={{ mr: 0.5 }} />
            {t('density-compact')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Stack>
  );
};

export default ThemeSettingsPanel;
