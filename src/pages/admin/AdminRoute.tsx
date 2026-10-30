import React, { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useIsAdmin } from '@labcabrera-rmu/rmu-react-shared-lib';
import ProtectedRoute from '../../services/auth/ProtectedRoute';

/** Signed-in administrators only; anyone else gets a "forbidden" notice. The APIs enforce it again. */
const AdminRoute: FC<{ children: ReactElement }> = ({ children }) => {
  const { t } = useTranslation();
  const admin = useIsAdmin();
  return (
    <ProtectedRoute>
      {admin ? (
        children
      ) : (
        <Box sx={{ display: 'grid', minHeight: 320, placeItems: 'center', px: 2 }}>
          <Paper sx={{ maxWidth: 420, p: 3, textAlign: 'center' }} elevation={2}>
            <Stack spacing={2} sx={{ alignItems: 'center' }}>
              <Typography variant="h5">{t('admin-forbidden-title')}</Typography>
              <Typography color="text.secondary">{t('admin-forbidden-text')}</Typography>
              <Button variant="contained" component={RouterLink} to="/">
                {t('home')}
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}
    </ProtectedRoute>
  );
};

export default AdminRoute;
