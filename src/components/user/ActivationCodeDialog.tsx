import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { TextField, Button, Stack, Alert, Box, Chip } from '@mui/material';
import { RmuDialog, SectionLabel } from '@labcabrera-rmu/rmu-react-shared-lib';
import { ActivationCode, userApiClient, apiErrorText } from '../../api/user-api-client';

export default function ActivationCodeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const auth = useAuth();
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [activationCode, setActivationCode] = useState<ActivationCode>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const currentFeatures = (auth.user?.profile.groups as string[]) || [];
  // A feature grants the realm group with the rmu- prefix (core-law → rmu-core-law).
  const owns = (feature: string) => currentFeatures.includes(`rmu-${feature}`);
  const newFeatures = activationCode ? activationCode.features.filter((e) => !owns(e)) : [];
  const ownedFeatures = activationCode ? activationCode.features.filter(owns) : [];

  const handleCheck = () => {
    if (!code) return;
    setErrorMessage(undefined);
    userApiClient
      .fetchActivateCode(code, auth)
      .then((response) => setActivationCode(response))
      .catch((err: unknown) => setErrorMessage(apiErrorText(err)));
  };

  const handleActivate = () => {
    if (!activationCode) return;
    userApiClient
      .activateCode(activationCode.code, auth)
      .then(() => auth.signinSilent())
      .then(() => onClose())
      .catch((err: unknown) => setErrorMessage(apiErrorText(err)));
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <RmuDialog
      open={open}
      onClose={handleClose}
      title={t('enter-activation-code')}
      maxWidth="sm"
      buttons={
        <>
          <Button variant="contained" color="success" onClick={handleCheck} disabled={!code}>
            {t('check')}
          </Button>
          <Button variant="contained" color="success" onClick={handleActivate} disabled={!activationCode || newFeatures.length === 0}>
            {t('activate')}
          </Button>
        </>
      }
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <TextField label={t('activation-code')} value={code} onChange={(e) => setCode(e.target.value)} fullWidth variant="outlined" />
      </Stack>

      {errorMessage && (
        <Box sx={{ mt: 2 }}>
          <Alert color="warning">{errorMessage}</Alert>
        </Box>
      )}

      {activationCode && (
        <Box>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <SectionLabel>{t('new-features')}</SectionLabel>
            <Stack direction="column" spacing={1}>
              {newFeatures.map((feature, index) => (
                <Chip key={index} label={t(feature)} color="success" />
              ))}
            </Stack>
            {newFeatures.length === 0 && <Alert color="warning">{t('no-new-features')}</Alert>}
            <SectionLabel>{t('already-owned-features')}</SectionLabel>
            <Stack direction="column" spacing={1}>
              {ownedFeatures.map((feature, index) => (
                <Chip key={index} label={t(feature)} color="secondary" disabled />
              ))}
            </Stack>
          </Stack>
        </Box>
      )}
    </RmuDialog>
  );
}
