import React, { FC, useState, MouseEvent } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';

interface UserMenuProps {
  userName?: string;
  avatarUrl?: string;
}

const UserMenu: FC<UserMenuProps> = ({ userName = 'User', avatarUrl = '' }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const oidc = useAuth();
  const isAuthenticated = !!oidc?.isAuthenticated;
  const user = (oidc?.user as any)?.profile ?? oidc?.user ?? null;
  const login = () => oidc?.signinRedirect?.();
  const logout = () => oidc?.signoutRedirect?.();

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = async () => {
    try {
      if (typeof document !== 'undefined' && 'requestStorageAccess' in document) {
        await document.requestStorageAccess();
      }
    } catch (e) {
      console.warn('[UserMenu] requestStorageAccess failed or denied', e);
    }
    login();
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: { xs: 1, md: 0 } }}>
        <Button
          variant="outlined"
          color="primary"
          href="/register"
          size="small"
          sx={{ display: { xs: 'none', sm: 'inline-flex' }, textTransform: 'none' }}
        >
          Register
        </Button>
        <Button color="primary" variant="outlined" size="small" onClick={handleLoginClick} sx={{ textTransform: 'none' }}>
          Login
        </Button>
      </Box>
    );
  }

  const displayName = user?.username || user?.name || userName;

  return (
    <>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open menu">
          <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
            <Avatar
              alt={displayName}
              src={avatarUrl || '/static/images/avatars/avatar-000.png'}
              sx={{ width: { xs: 36, md: 45 }, height: { xs: 36, md: 45 } }}
            >
              {displayName[0]}
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
            <Typography textAlign="center">Profile</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              logout();
            }}
          >
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};

export default UserMenu;
