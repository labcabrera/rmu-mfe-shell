import React, { FC, useState, MouseEvent } from 'react';
import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';

interface UserMenuProps {
  userName?: string;
  avatarUrl?: string;
}

const UserMenu: FC<UserMenuProps> = ({ userName = 'Usuario', avatarUrl = '' }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open menu">
        <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
          <Avatar alt={userName} src="/static/images/avatars/avatar-000.png" sx={{ width: 60, height: 60 }}>
            {userName[0]}
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
        <MenuItem onClick={handleCloseMenu}>
          <Typography textAlign="center">Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <Typography textAlign="center">Settings</Typography>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <a href="/logout" style={{ textDecoration: 'none', color: 'inherit' }}>
            Logout
          </a>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
