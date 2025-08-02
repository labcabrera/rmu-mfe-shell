import React from 'react';
import { useAuth } from '../../contexts/auth-context';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Login as LoginIcon, PersonAdd as RegisterIcon } from '@mui/icons-material';

const ProtectedRoute = ({ 
  children, 
  roles = [], 
  requireAuth = true,
  fallback = null 
}) => {
  const { isAuthenticated, isLoading, user, login, register, hasAnyRole } = useAuth();

  // Show loading while auth is initializing
  if (isLoading) {
    return fallback || <div>Loading...</div>;
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h5" gutterBottom>
            Authentication Required
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            You need to be logged in to access this page.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={() => login()}
              size="large"
            >
              Login
            </Button>
            <Button
              variant="outlined"
              startIcon={<RegisterIcon />}
              onClick={() => register()}
              size="large"
            >
              Register
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // If specific roles are required but user doesn't have them
  if (roles.length > 0 && isAuthenticated && !hasAnyRole(roles)) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h5" gutterBottom color="error">
            Access Denied
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            You don't have the required permissions to access this page.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Required roles: {roles.join(', ')}
          </Typography>
          {user?.roles && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Your roles: {user.roles.join(', ') || 'None'}
            </Typography>
          )}
        </Paper>
      </Box>
    );
  }

  // User is authenticated and has required roles (or no roles required)
  return children;
};

export default ProtectedRoute;
