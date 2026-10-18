import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { BottomNavigation, BottomNavigationAction, Box, Drawer, Paper, useMediaQuery, useTheme } from '@mui/material';
import NavList from './NavList';
import { activeSection, sections } from './sections';

export const BOTTOM_NAV_HEIGHT = 56;

// Destinations of the bottom bar: home, the three main modules and "more", which opens the drawer.
const bottomSections = sections.filter((section) => ['core', 'strategic', 'tactical'].includes(section.label));

/**
 * Phone navigation: a bottom bar with the main destinations and a drawer with every section and page.
 * Sets --rmu-bottom-nav-height so fixed elements of the pages (FABs, save bars) stay above the bar.
 */
const MobileNav = ({ drawerOpen, onDrawerChange }: { drawerOpen: boolean; onDrawerChange: (open: boolean) => void }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const root = document.documentElement;
    if (isPhone) root.style.setProperty('--rmu-bottom-nav-height', `${BOTTOM_NAV_HEIGHT}px`);
    else root.style.removeProperty('--rmu-bottom-nav-height');
  }, [isPhone]);

  useEffect(() => {
    onDrawerChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const [value, setValue] = useState<string>();
  useEffect(() => {
    const current = activeSection(pathname);
    setValue(pathname === '/' ? '/' : (bottomSections.find((s) => s.href === current?.href)?.href ?? 'more'));
  }, [pathname]);

  if (!isPhone) return null;

  return (
    <>
      <Drawer anchor="left" open={drawerOpen} onClose={() => onDrawerChange(false)}>
        <Box sx={{ width: 280 }}>
          <NavList onNavigate={() => onDrawerChange(false)} />
        </Box>
      </Drawer>
      <Paper
        elevation={8}
        sx={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: theme.zIndex.appBar }}
        component="nav"
        aria-label={t('menu')}
      >
        <BottomNavigation
          showLabels
          value={value}
          // MUI gives every action min-width 80: five of them overflow a 390 px phone. They share the width instead.
          sx={{
            height: BOTTOM_NAV_HEIGHT,
            '& .MuiBottomNavigationAction-root': { minWidth: 0, flex: 1, px: 0.5 },
            '& .MuiBottomNavigationAction-label': { maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
          }}
          onChange={(_, next: string) => (next === 'more' ? onDrawerChange(true) : navigate(next))}
        >
          <BottomNavigationAction label={t('home')} value="/" icon={<HomeOutlinedIcon />} />
          {bottomSections.map((section) => {
            const Icon = section.icon;
            return <BottomNavigationAction key={section.href} label={t(section.label)} value={section.href} icon={<Icon />} />;
          })}
          <BottomNavigationAction label={t('more')} value="more" icon={<MenuIcon />} />
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default MobileNav;
