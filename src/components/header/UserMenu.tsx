import React, { FC, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Link,
} from '@mui/material';
import { useAuth } from '../../services/auth/AuthProvider';

interface UserMenuProps {
  userName?: string;
  avatarUrl?: string;
}

const UserMenu: FC<UserMenuProps> = ({ userName = 'User', avatarUrl = '' }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isAuthenticated, user, login, logout } = useAuth();
  const [openRegister, setOpenRegister] = useState(false);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenRegister = () => {
    setOpenRegister(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
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
      <Box sx={{ flexGrow: 0 }}>
        <Button variant="outlined" color="primary" onClick={handleOpenRegister} sx={{ mr: 1, display: { xs: 'none', md: 'inline-flex' } }}>
          Register
        </Button>
        <Button color="inherit" variant="outlined" onClick={handleLoginClick}>
          Login
        </Button>
        <Dialog open={openRegister} onClose={handleCloseRegister} aria-labelledby="register-dialog-title">
          <DialogTitle id="register-dialog-title">Account Registration</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Because this application contains material licensed by{' '}
              <Link href="https://ironcrown.co.uk/" color="primary">
                Iron Crown Enterprises
              </Link>
              , creating new accounts is not permitted. If you are interested, please send an email to the contact address{' '}
              <Link href="mailto:lab.cabrera@gmail.com">lab.cabrera@gmail.com</Link>.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRegister} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  const displayName = user?.username || userName;

  return (
    <>
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
    </>
  );
};

export default UserMenu;
