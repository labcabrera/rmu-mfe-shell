import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import { Box, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import ThemeSettingsPanel from '../../theme/ThemeSettingsPanel';

// Header button that opens the appearance settings: preset, light or dark, and density.
const ThemeSelector = () => {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <Tooltip title={t('appearance')}>
        <IconButton color="inherit" aria-label={t('appearance')} onClick={(event) => setAnchor(event.currentTarget)}>
          <PaletteOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1, width: 340, maxWidth: 'calc(100vw - 16px)' } } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            {t('appearance')}
          </Typography>
          <ThemeSettingsPanel />
        </Box>
      </Popover>
    </>
  );
};

export default ThemeSelector;
