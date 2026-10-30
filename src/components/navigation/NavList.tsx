import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Collapse, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { activeParentSx, activeSection, isActiveLink, navItemSx, sections } from './sections';

/** Full navigation list: sections with their pages, the current one expanded. Used by the rail and the drawer. */
const NavList = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const current = activeSection(pathname);
  const [expanded, setExpanded] = useState<string | undefined>(current?.label);

  useEffect(() => {
    if (current) setExpanded(current.label);
  }, [current]);

  return (
    <List component="nav" aria-label={t('menu')} sx={{ py: 1 }}>
      <ListItemButton component={RouterLink} to="/" selected={pathname === '/'} onClick={onNavigate} sx={navItemSx}>
        <ListItemIcon>
          <HomeOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary={t('home')} />
      </ListItemButton>
      {sections.map((section) => {
        const Icon = section.icon;
        const open = expanded === section.label;
        const selected = pathname === section.href;
        return (
          <React.Fragment key={section.label}>
            <ListItemButton
              component={RouterLink}
              to={section.href}
              selected={selected}
              sx={[navItemSx, !selected && current?.label === section.label && activeParentSx]}
              onClick={() => {
                setExpanded(section.label);
                onNavigate?.();
              }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={t(section.label)} />
              {section.links.length > 0 && (
                <IconButton
                  size="small"
                  edge="end"
                  aria-label={t(open ? 'collapse' : 'expand')}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setExpanded(open ? undefined : section.label);
                  }}
                >
                  {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
            </ListItemButton>
            {section.links.length > 0 && (
              <Collapse in={open} unmountOnExit>
                <List disablePadding>
                  {section.links.map((link) => (
                    <ListItemButton
                      key={link.href}
                      component={RouterLink}
                      to={link.href}
                      selected={isActiveLink(pathname, link.href)}
                      onClick={onNavigate}
                      sx={[navItemSx, { pl: 8 }]}
                    >
                      <ListItemText primary={t(link.label)} slotProps={{ primary: { variant: 'body2' } }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default NavList;
