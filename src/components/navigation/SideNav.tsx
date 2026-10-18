import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Box, Drawer, List, ListItemButton, ListItemIcon, Toolbar, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import NavList from './NavList';
import { activeSection, sections } from './sections';

export const RAIL_WIDTH = 248;
export const MINI_RAIL_WIDTH = 72;

/** Rail entry for the home page; `label` is an i18n key. */
const HOME_ITEM = { label: 'home', href: '/', icon: HomeOutlinedIcon };

/**
 * Permanent side navigation from the `sm` breakpoint up: the full list with pages on desktop (lg+),
 * an icon rail on tablets (sm–md) whose icons open each section's home. Phones use MobileNav instead.
 */
const SideNav = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { pathname } = useLocation();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  if (isPhone) return null;

  const width = isDesktop ? RAIL_WIDTH : MINI_RAIL_WIDTH;
  const current = activeSection(pathname);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width, boxSizing: 'border-box', borderRight: 1, borderColor: 'divider' },
      }}
    >
      {/* Spacer under the sticky app bar. */}
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
      <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
        {isDesktop ? (
          <NavList />
        ) : (
          <List component="nav" aria-label={t('menu')}>
            {[HOME_ITEM, ...sections].map((section) => {
              const Icon = section.icon;
              const selected = section.href === '/' ? pathname === '/' : current?.href === section.href;
              return (
                <Tooltip key={section.href} title={t(section.label)} placement="right">
                  <ListItemButton
                    component={RouterLink}
                    to={section.href}
                    selected={selected}
                    aria-label={t(section.label)}
                    sx={{ justifyContent: 'center', minHeight: 56 }}
                  >
                    <ListItemIcon sx={{ minWidth: 0 }}>
                      <Icon />
                    </ListItemIcon>
                  </ListItemButton>
                </Tooltip>
              );
            })}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default SideNav;
