import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { MessageScreen } from '@labcabrera-rmu/rmu-react-shared-lib';

// Rendered instead of a remote micro-frontend that could not be loaded (container stopped and no
// dev server running, or RMU_MFE_<NAME>_PUBLIC_PATH not configured) or that failed while rendering.
// The rest of the shell keeps working.
const RemoteUnavailable = ({ name }: { name: string }) => {
  const { t } = useTranslation();
  return (
    <MessageScreen
      icon={<WarningAmberIcon color="warning" sx={{ fontSize: 48 }} />}
      title={t('module-unavailable')}
      text={t('module-unavailable-message', { name })}
      // A failed remote stays failed in webpack's module cache: only a new page load can bring it back.
      action={
        <Button variant="outlined" onClick={() => window.location.reload()}>
          {t('reload-page')}
        </Button>
      }
    />
  );
};

export default RemoteUnavailable;
