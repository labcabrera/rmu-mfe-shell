import React from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';

// Rendered instead of a remote micro-frontend that could not be loaded (container stopped and no
// dev server running, or RMU_MFE_<NAME>_PUBLIC_PATH not configured) or that failed while rendering.
// The rest of the shell keeps working.
const RemoteUnavailable = ({ name }: { name: string }) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ p: 4 }}>
      <Alert severity="warning">
        <AlertTitle>{t('module-unavailable')}</AlertTitle>
        {t('module-unavailable-message', { name })}
      </Alert>
    </Box>
  );
};

export default RemoteUnavailable;
