import React, { FC, useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, Button, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { imageBaseUrl } from '../../services/config';
import { useApiUser } from '../../services/user/ApiUserProvider';

const DEFAULT_IMAGE = `${imageBaseUrl}images/generic/races.png`;

const UserMenu: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const oidc = useAuth();
  const { apiUser } = useApiUser();
  const isAuthenticated = !!oidc?.isAuthenticated;
  const login = () => oidc.signinRedirect({ state: { returnTo: `${location.pathname}${location.search}${location.hash}` } });
  const logout = () => oidc?.signoutRedirect?.();
  const userName = apiUser?.name || oidc.user?.profile.preferred_username || 'Undefined';
  const avatarUrl = apiUser?.imageUrl || DEFAULT_IMAGE;
  const avatarInitials = userName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    login();
  };

  const headerButtonSx = {
    color: 'inherit',
    borderColor: 'currentColor',
    textTransform: 'none',
    '&:hover': {
      borderColor: 'currentColor',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: { xs: 1, md: 0 } }}>
        <Button
          variant="outlined"
          color="inherit"
          component={RouterLink}
          to="/register"
          size="small"
          sx={headerButtonSx}
        >
          {t('register')}
        </Button>
        <Button color="inherit" variant="outlined" size="small" onClick={handleLoginClick} sx={headerButtonSx}>
          {t('login')}
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open menu">
          <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
            <Avatar
              alt={userName}
              src={avatarUrl}
              sx={{ width: { xs: 36, md: 45 }, height: { xs: 36, md: 45 } }}
            >
              {avatarInitials}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              navigate('/user-profile');
            }}
          >
            <Typography sx={{ textAlign: 'center' }}>{t('profile')}</Typography>
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleCloseMenu();
              logout();
            }}
          >
            <Typography sx={{ textAlign: 'center' }}>{t('logout', 'Logout')}</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};

export default UserMenu;
