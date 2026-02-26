import React, { FC, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { useAuth } from '../../services/auth/AuthProvider';

interface UserMenuProps {
  userName?: string;
  avatarUrl?: string;
}

const UserMenu: FC<UserMenuProps> = ({ userName = 'Usuario', avatarUrl = '' }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isAuthenticated, user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = async () => {
    // Storage Access API must be called from a user gesture. Try to request it first.
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
      <Box sx={{ flexGrow: 0 }}>
        <Button color="inherit" variant="outlined" onClick={handleLoginClick}>
          Login
        </Button>
      </Box>
    );
  }

  const displayName = user?.username || userName;

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open menu">
        <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
          <Avatar alt={displayName} src={avatarUrl || '/static/images/avatars/avatar-000.png'} sx={{ width: 60, height: 60 }}>
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
        <MenuItem onClick={handleCloseMenu}>
          <Typography textAlign="center">Settings</Typography>
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
  );
};

export default UserMenu;
