import React from 'react';
import { useAuth } from '../../contexts/auth-context';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';

const AuthDebug = () => {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    error, 
    login, 
    logout, 
    hasRole,
    hasAnyRole 
  } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading authentication...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Authentication Debug
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      )}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Authentication Status
          </Typography>
          <Typography>
            <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
          </Typography>
          <Typography>
            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </Typography>
          <Typography>
            <strong>Error:</strong> {error || 'None'}
          </Typography>
        </CardContent>
      </Card>

      {isAuthenticated ? (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            {user ? (
              <Box>
                <Typography><strong>ID:</strong> {user.id || 'N/A'}</Typography>
                <Typography><strong>Username:</strong> {user.username || 'N/A'}</Typography>
                <Typography><strong>Email:</strong> {user.email || 'N/A'}</Typography>
                <Typography><strong>First Name:</strong> {user.firstName || 'N/A'}</Typography>
                <Typography><strong>Last Name:</strong> {user.lastName || 'N/A'}</Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Roles:</strong>
                </Typography>
                {user.roles && user.roles.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {user.roles.map((role, index) => (
                      <Chip key={index} label={role} size="small" />
                    ))}
                  </Box>
                ) : (
                  <Typography color="textSecondary">No roles assigned</Typography>
                )}

                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Role Checks:</strong>
                </Typography>
                <Typography>Has 'admin' role: {hasRole('admin') ? 'Yes' : 'No'}</Typography>
                <Typography>Has 'user' role: {hasRole('user') ? 'Yes' : 'No'}</Typography>
                <Typography>Has any admin roles: {hasAnyRole(['admin', 'administrator']) ? 'Yes' : 'No'}</Typography>
              </Box>
            ) : (
              <Typography color="textSecondary">No user data available</Typography>
            )}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {!isAuthenticated ? (
              <>
                <Button variant="contained" onClick={() => login()}>
                  Login
                </Button>
                <Button variant="outlined" onClick={() => login({ action: 'register' })}>
                  Register
                </Button>
              </>
            ) : (
              <Button variant="contained" color="secondary" onClick={() => logout()}>
                Logout
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {user && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Raw User Data (Debug)
            </Typography>
            <Box 
              component="pre" 
              sx={{ 
                backgroundColor: 'grey.100', 
                p: 2, 
                borderRadius: 1,
                overflow: 'auto',
                fontSize: '0.75rem'
              }}
            >
              {JSON.stringify(user, null, 2)}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AuthDebug;
