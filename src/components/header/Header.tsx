import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import HeaderNavButtons from './HeaderNavButtons';
import LanguageSelector from './LanguageSelector';
import MobileMenu from './MobileMenu';
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
    label: 'strategic',
    href: '/strategic',
    links: [
      { label: 'strategic-module', href: '/strategic' },
      { label: 'strategic-games', href: '/strategic/games' },
      { label: 'factions', href: '/strategic/factions' },
      { label: 'characters', href: '/strategic/characters' },
    ],
  },
  {
    label: 'tactical',
    href: '/tactical',
    links: [
      { label: 'tactical-module', href: '/tactical' },
      { label: 'tactical-games', href: '/tactical/games' },
    ],
  },
  { label: 'npcs', href: '/npcs', links: [{ label: 'npcs', href: '/npcs' }] },
  { label: 'items', href: '/items', links: [{ label: 'items', href: '/items' }] },
  {
    label: 'spells',
    href: '/spells',
    links: [
      { label: 'spell-lists', href: '/spells/spell-lists' },
      { label: 'spells', href: '/spells/spells' },
    ],
  },
];

const Header = () => {
  const { i18n } = useTranslation();
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
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 60, md: 80 }, px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: { xs: 1, md: 2 }, minWidth: 0 }}>
            <MobileMenu pages={pages} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <FilterVintageIcon sx={{ fontSize: { xs: 22, md: 32 }, minWidth: 28 }} />
              <Typography
                color="primary"
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
              >
                RMU-Engine
              </Typography>
            </Box>

            <Box sx={{ flex: '1 1 auto', minWidth: 0, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <HeaderNavButtons pages={pages} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, flexShrink: 0, ml: { xs: 'auto', md: 0 } }}>
              <LanguageSelector />
              <UserMenu />
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
