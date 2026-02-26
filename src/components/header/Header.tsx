import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AdbIcon from '@mui/icons-material/Adb';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link,
} from '@mui/material';
import UserMenu from './UserMenu';

const imageBaseUrl = process.env.RMU_MFE_ASSETS!;

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
  const [openRegister, setOpenRegister] = React.useState(false);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenRegister = () => {
    setOpenRegister(true);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            color="primary"
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.3rem',
              textDecoration: 'none',
            }}
          >
            RMU Engine
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

          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            RMU Engine
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
          <Button variant="outlined" color="primary" onClick={handleOpenRegister} sx={{ mr: 1, display: { xs: 'none', md: 'inline-flex' } }}>
            Register
          </Button>
          <UserMenu userName="User name" avatarUrl={`${imageBaseUrl}images/generic/races.png`} />

          <Dialog open={openRegister} onClose={handleCloseRegister} aria-labelledby="register-dialog-title">
            <DialogTitle id="register-dialog-title">Account Registration</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Because this application contains material licensed by <Link href="https://ironcrown.co.uk/">Iron Crown Enterprises</Link>, creating
                new accounts is not permitted. If you are interested, please send an email to the contact address{' '}
                <Link href="mailto:lab.cabrera@gmail.com">lab.cabrera@gmail.com</Link>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseRegister} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
