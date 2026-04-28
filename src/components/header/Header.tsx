import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Popper,
  Paper,
  ClickAwayListener,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { imageBaseUrl } from '../../services/config';
import HeaderNavButtons from './HeaderNavButtons';
import LanguageSelector from './LanguageSelector';
import UserMenu from './UserMenu';

const pages = [
  {
    label: 'core',
    href: '/core',
    links: [
      { label: 'core', href: '/core' },
      { label: 'realms', href: '/core/realms' },
      { label: 'races', href: '/core/races' },
      { label: 'professions', href: '/core/professions' },
      { label: 'skill-categories', href: '/core/skills' },
      { label: 'skills', href: '/core/skills' },
      { label: 'traits', href: '/core/traits' },
      { label: 'maneuvers', href: '/core/maneuvers' },
    ],
  },
  {
    label: 'Strategic',
    href: '/strategic',
    links: [
      { label: 'strategic', href: '/strategic' },
      { label: 'strategic-games', href: '/strategic' },
    ],
  },
  {
    label: 'tactical',
    href: '/tactical',
    links: [
      { label: 'tactical', href: '/tactical' },
      { label: 'tactical-games', href: '/tactical' },
    ],
  },
  { label: 'npcs', href: '/npcs', links: [{ label: 'npcs', href: '/npcs' }] },
  { label: 'items', href: '/items', links: [{ label: 'items', href: '/items' }] },
  {
    label: 'spells',
    href: '/spells',
    links: [
      { label: 'spells', href: '/spells' },
      { label: 'spell-lists', href: '/spells/spell-lists' },
    ],
  },
];

const Header = () => {
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
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

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // nav section handling moved to HeaderNavButtons

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 60, md: 80 },
            alignItems: 'center',
            py: { xs: 1, md: 1 },
            position: 'relative',
          }}
        >
          <FilterVintageIcon
            sx={{
              display: { xs: 'none', md: 'flex' },
              mr: 1,
              fontSize: { xs: 22, md: 32 },
              alignSelf: 'center',
              // ensure icon is placed before the text
              order: { md: -1 },
              // prevent the icon from being visually clipped
              minWidth: { md: 36 },
              minHeight: { md: 36 },
              boxSizing: 'content-box',
            }}
          />
          <Typography
            color="primary"
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              // keep default order so the icon's order ensures it appears first
              order: { md: 0 },
              textDecoration: 'none',
              py: 0,
              alignItems: 'center',
            }}
          >
            RMU-Engine
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to={'/'}>
                {t('home')}
              </MenuItem>
              {pages.map((page, index) => (
                <MenuItem key={index} onClick={handleCloseNavMenu} component={RouterLink} to={page.href}>
                  {t(page.label)}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <FilterVintageIcon sx={{ display: { xs: 'none', md: 'none' }, mr: 1, fontSize: { xs: 20, md: 32 } }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 800,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              lineHeight: 1,
              py: 0,
              alignItems: 'center',
            }}
          >
            RMU-E
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', width: '100%', alignItems: 'center' }}>
            <HeaderNavButtons pages={pages} />

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'flex-end',
                ml: 2,
                pr: { xs: 1, md: 2 },
                minWidth: 0,
                gap: 3,
              }}
            >
              <LanguageSelector />
              <UserMenu avatarUrl={`${imageBaseUrl}images/generic/races.png`} />
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
