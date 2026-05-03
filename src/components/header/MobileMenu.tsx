import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Drawer, IconButton, List, ListItemButton, ListItemText } from '@mui/material';

type LinkItem = { label: string; href: string };
type Page = { label: string; href: string; links?: LinkItem[] };

const MobileMenu: React.FC<{ pages: Page[] }> = ({ pages }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const toggle = (v: boolean) => () => setOpen(v);

  return (
    <>
      <Box sx={{ display: { xs: 'flex', lg: 'none', xl: 'none' }, alignItems: 'center' }}>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggle(true)} sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Drawer anchor="left" open={open} onClose={toggle(false)}>
        <Box sx={{ width: 260 }} role="presentation" onClick={toggle(false)} onKeyDown={toggle(false)}>
          <List>
            <ListItemButton component={RouterLink} to={'/'}>
              <ListItemText primary={t('home')} />
            </ListItemButton>
            {pages.map((p, index) => (
              <ListItemButton key={index} component={RouterLink} to={p.href}>
                <ListItemText primary={t(p.label)} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileMenu;
