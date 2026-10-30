import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import NavList from './NavList';
import { activeSection, isActiveLink, isImmersiveRoute, navItemSx, NavSection, sections } from './sections';

export const RAIL_WIDTH = 248;
export const MINI_RAIL_WIDTH = 72;

type NavMode = 'expanded' | 'rail';

/** Stored choice of the desktop navigation (spec 017). */
const STORAGE_KEY = 'rmuNav';

const readPreference = (): NavMode => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'rail' ? 'rail' : 'expanded';
  } catch {
    return 'expanded';
  }
};

const writePreference = (mode: NavMode) => {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Without storage the choice only lasts until the page reloads.
  }
};

/**
 * Mode of the side navigation: tablets always get the icon rail; on desktop (lg+) the user's stored choice, except
 * on immersive pages, which start as a rail and keep a change only for that visit.
 */
const useNavMode = (isDesktop: boolean, pathname: string) => {
  const [preference, setPreference] = useState<NavMode>(readPreference);
  const immersive = isImmersiveRoute(pathname);
  const [visitOverride, setVisitOverride] = useState<NavMode>();

  useEffect(() => setVisitOverride(undefined), [immersive]);

  const mode: NavMode = !isDesktop ? 'rail' : immersive ? (visitOverride ?? 'rail') : preference;
  const toggle = () => {
    const next: NavMode = mode === 'rail' ? 'expanded' : 'rail';
    if (immersive) setVisitOverride(next);
    else {
      setPreference(next);
      writePreference(next);
    }
  };
  return { mode, toggle };
};

/** Rail entry for the home page; `label` is an i18n key. */
const HOME_ITEM: NavSection = { label: 'home', href: '/', icon: HomeOutlinedIcon, links: [] };

/**
 * Icon rail: each icon opens its section's home, and hovering or focusing it shows the section's pages in a flyout,
 * so folding the menu loses no navigation.
 */
const RailList = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const current = activeSection(pathname);
  const [flyout, setFlyout] = useState<{ section: NavSection; anchor: HTMLElement }>();
  const closeTimer = useRef<number | undefined>(undefined);

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setFlyout(undefined), 150);
  };
  const show = (section: NavSection, anchor: HTMLElement) => {
    cancelClose();
    setFlyout(section.links.length > 0 ? { section, anchor } : undefined);
  };

  useEffect(() => setFlyout(undefined), [pathname]);
  useEffect(() => cancelClose, []);

  return (
    <>
      <List component="nav" aria-label={t('menu')}>
        {[HOME_ITEM, ...sections].map((section) => {
          const Icon = section.icon;
          const selected = section.href === '/' ? pathname === '/' : current?.href === section.href;
          const button = (
            <ListItemButton
              component={RouterLink}
              to={section.href}
              selected={selected}
              aria-label={t(section.label)}
              aria-haspopup={section.links.length > 0 ? 'menu' : undefined}
              onMouseEnter={(event: React.MouseEvent<HTMLElement>) => show(section, event.currentTarget)}
              onMouseLeave={scheduleClose}
              onFocus={(event: React.FocusEvent<HTMLElement>) => show(section, event.currentTarget)}
              onKeyDown={(event: React.KeyboardEvent) => event.key === 'Escape' && setFlyout(undefined)}
              sx={[navItemSx, { justifyContent: 'center', minHeight: 52 }]}
            >
              <ListItemIcon sx={{ minWidth: 0 }}>
                <Icon />
              </ListItemIcon>
            </ListItemButton>
          );
          // Sections with pages show their name in the flyout; the rest keep the tooltip.
          return section.links.length > 0 ? (
            <React.Fragment key={section.href}>{button}</React.Fragment>
          ) : (
            <Tooltip key={section.href} title={t(section.label)} placement="right">
              {button}
            </Tooltip>
          );
        })}
      </List>
      <Popper
        open={!!flyout}
        anchorEl={flyout?.anchor}
        placement="right-start"
        sx={(theme) => ({ zIndex: theme.zIndex.appBar + 1 })}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        {flyout && (
          <Paper elevation={6} sx={{ minWidth: 200, py: 0.5, ml: 0.5 }}>
            <Typography variant="overline" color="text.secondary" component="div" sx={{ px: 2, pt: 0.5 }}>
              {t(flyout.section.label)}
            </Typography>
            <List dense disablePadding aria-label={t(flyout.section.label)}>
              {flyout.section.links.map((link) => (
                <ListItemButton
                  key={link.href}
                  component={RouterLink}
                  to={link.href}
                  selected={isActiveLink(pathname, link.href)}
                  onFocus={cancelClose}
                  onBlur={scheduleClose}
                  onKeyDown={(event: React.KeyboardEvent) => event.key === 'Escape' && setFlyout(undefined)}
                  sx={navItemSx}
                >
                  <ListItemText primary={t(link.label)} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </Popper>
    </>
  );
};

/**
 * Permanent side navigation from the `sm` breakpoint up. On desktop (lg+) it folds between the full list with pages
 * and the icon rail (stored choice; immersive pages such as the combat board start folded); tablets (sm–md) always
 * get the rail. Phones use MobileNav instead.
 */
const SideNav = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { pathname } = useLocation();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const { mode, toggle } = useNavMode(isDesktop, pathname);
  if (isPhone) return null;

  const width = mode === 'expanded' ? RAIL_WIDTH : MINI_RAIL_WIDTH;
  const widthTransition = theme.transitions.create('width', { duration: theme.motion.duration.base });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        transition: widthTransition,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          borderRight: 1,
          borderColor: 'divider',
          overflowX: 'hidden',
          transition: widthTransition,
        },
      }}
    >
      {/* Spacer under the sticky app bar. */}
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>{mode === 'expanded' ? <NavList /> : <RailList />}</Box>
      {isDesktop && (
        <>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: mode === 'expanded' ? 'flex-end' : 'center', p: 1 }}>
            <Tooltip title={t(mode === 'expanded' ? 'collapse-menu' : 'expand-menu')} placement="right">
              <IconButton onClick={toggle} aria-label={t(mode === 'expanded' ? 'collapse-menu' : 'expand-menu')} aria-expanded={mode === 'expanded'}>
                {mode === 'expanded' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default SideNav;
