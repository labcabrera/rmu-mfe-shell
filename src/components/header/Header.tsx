import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { imageBaseUrl } from '../../services/config';
import UserMenu from './UserMenu';

const pages = [
  { label: 'Core', href: '/core' },
  { label: 'Strategic', href: '/strategic' },
  { label: 'Tactical', href: '/tactical' },
  { label: 'NPCs', href: '/npcs' },
  { label: 'Items', href: '/items' },
  { label: 'Spells', href: '/spells' },
];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 60, md: 80 },
            alignItems: 'center',
            py: { xs: 1, md: 1 },
          }}
        >
          <FilterVintageIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: { xs: 22, md: 32 }, alignSelf: 'center' }} />
          <Typography
            color="primary"
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
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
              {pages.map((page, index) => (
                <MenuItem key={index} onClick={handleCloseNavMenu} component={RouterLink} to={page.href}>
                  {page.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <FilterVintageIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, fontSize: { xs: 20, md: 32 } }} />
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
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                component={RouterLink}
                to={page.href}
                onClick={handleCloseNavMenu}
                variant="text"
                color="primary"
                sx={{ my: 2, display: 'block' }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
          <UserMenu userName="User name" avatarUrl={`${imageBaseUrl}images/generic/races.png`} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
