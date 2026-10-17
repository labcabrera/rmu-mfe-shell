import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';

// Rendered instead of a remote micro-frontend that could not be loaded (container stopped and no
// dev server running, or RMU_MFE_<NAME>_PUBLIC_PATH not configured). The rest of the shell keeps working.
const RemoteUnavailable = ({ name }: { name: string }) => (
  <Box sx={{ p: 4 }}>
    <Alert severity="warning">
      <AlertTitle>Module not available</AlertTitle>
      The {name} module could not be loaded. Try again later.
    </Alert>
  </Box>
);

export default RemoteUnavailable;
