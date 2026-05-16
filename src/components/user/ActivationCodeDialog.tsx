import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField, Button, Stack, Alert, Box, Chip, Typography } from '@mui/material';
import { ActivationCode, userApiClient } from '../../api/user-api-client';

export default function ActivationCodeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const auth = useAuth();
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [activationCode, setActivationCode] = useState<ActivationCode>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const currentFeatures = (auth.user?.profile.groups as string[]) || [];
  const newFeatures = activationCode ? activationCode.features.filter((e) => !currentFeatures.includes(e)) : [];
  const ownedFeatures = activationCode ? activationCode.features.filter((e) => currentFeatures.includes(e)) : [];

  const handleCheck = () => {
    if (!code) return;
    setErrorMessage(undefined);
    userApiClient
      .fetchActivateCode(code, auth)
      .then((response) => setActivationCode(response))
      .catch((err) => setErrorMessage(err.message));
  };

  const handleActivate = () => {
    if (!activationCode) return;
    userApiClient
      .activateCode(activationCode.code, auth)
      .then(() => {
        auth.signinSilent().then(() => onClose());
      })
      .catch((err) => console.error(err));
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {t('enter-activation-code')}
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
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
              <Typography>{t('new-features')}</Typography>
              <Stack direction="column" spacing={1}>
                {newFeatures.map((feature, index) => (
                  <Chip key={index} label={t(feature)} color="success" />
                ))}
              </Stack>
              {newFeatures.length === 0 && <Alert color="warning">{t('no-new-features')}</Alert>}
              <Typography>{t('already-owned-features')}</Typography>
              <Stack direction="column" spacing={1}>
                {ownedFeatures.map((feature, index) => (
                  <Chip key={index} label={t(feature)} color="secondary" disabled />
                ))}
              </Stack>
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          {t('close')}
        </Button>
        <Button variant="contained" color="success" onClick={handleCheck} disabled={!code}>
          {t('check')}
        </Button>
        <Button variant="contained" color="success" onClick={handleActivate} disabled={!activationCode || newFeatures.length === 0}>
          {t('activate')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
