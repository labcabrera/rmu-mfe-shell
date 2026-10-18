import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, GlobalStyles, IconButton, Toolbar, Typography } from '@mui/material';
import LanguageSelector from './LanguageSelector';
import ThemeSelector from './ThemeSelector';
import UserMenu from './UserMenu';

/** Brand name: not translated. */
const BRAND_NAME = 'RMU-Engine';

// Sticky top bar above the side navigation. On phones the menu button opens the navigation drawer.
const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { t, i18n } = useTranslation();
  const [, setTick] = React.useState(0);

  useEffect(() => {
    const onLang = () => setTick((v) => v + 1);
    i18n.on?.('languageChanged', onLang);
    window.addEventListener('rmu:languageChanged', onLang as EventListener);
    return () => {
      i18n.off?.('languageChanged', onLang);
      window.removeEventListener('rmu:languageChanged', onLang as EventListener);
    };
  }, [i18n]);

  return (
    <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      {/* Sticky elements of the remotes (detail page headers) stick right under the app bar. */}
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--rmu-app-bar-height': '56px',
            [theme.breakpoints.up('sm')]: { '--rmu-app-bar-height': '64px' },
          },
        })}
      />
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 }, gap: { xs: 1, md: 2 } }}>
        <IconButton color="inherit" aria-label={t('menu')} onClick={onMenuClick} sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
          <FilterVintageIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', minHeight: 44 }}
          >
            {BRAND_NAME}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 2 }, flexShrink: 0 }}>
          <ThemeSelector />
          <LanguageSelector />
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
