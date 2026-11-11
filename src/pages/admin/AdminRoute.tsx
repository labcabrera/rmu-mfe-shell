import { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/material';
import { MessageScreen, useIsAdmin } from '@labcabrera-rmu/rmu-react-shared-lib';
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
        <MessageScreen
          title={t('admin-forbidden-title')}
          text={t('admin-forbidden-text')}
          action={
            <Button variant="contained" component={RouterLink} to="/">
              {t('home')}
            </Button>
          }
        />
      )}
    </ProtectedRoute>
  );
};

export default AdminRoute;
