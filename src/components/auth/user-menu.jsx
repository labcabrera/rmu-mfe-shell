import React, { useState } from 'react';
import {
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  Login as LoginIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  PersonAdd as RegisterIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/auth-context';

const UserMenu = () => {
  const { isAuthenticated, user, login, logout, register } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getDisplayName = () => {
    if (!user) return '';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    if (user.username) {
      return user.username;
    }
    
    if (user.email) {
      return user.email;
    }
    
    return 'User';
  };

  if (!isAuthenticated) {
    return (
      <Box display="flex" gap={1}>
        <Button
          color="inherit"
          startIcon={<LoginIcon />}
          onClick={() => login()}
          size="small"
        >
          Login
        </Button>
        <Button
          color="inherit"
          variant="outlined"
          startIcon={<RegisterIcon />}
          onClick={() => register()}
          size="small"
        >
          Register
        </Button>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Button
        color="inherit"
        onClick={handleMenuOpen}
        startIcon={
          <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
            {user?.firstName && user?.lastName 
              ? getInitials(user.firstName, user.lastName)
              : <AccountIcon />
            }
          </Avatar>
        }
      >
        {getDisplayName()}
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { minWidth: 250 }
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {getDisplayName()}
          </Typography>
          {user?.email && (
            <Typography variant="body2" color="textSecondary">
              {user.email}
            </Typography>
          )}
          {user?.roles && user.roles.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {user.roles.slice(0, 3).map((role) => (
                <Chip
                  key={role}
                  label={role}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: 20 }}
                />
              ))}
              {user.roles.length > 3 && (
                <Chip
                  label={`+${user.roles.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: 20 }}
                />
              )}
            </Box>
          )}
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
