import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField, Button, Stack, Alert, Box } from '@mui/material';
import { ActivationCode, userApiClient } from '../../api/user-api-client';

export default function ActivationCodeDialog({ open, onActivate, onClose }: { open: boolean; onActivate: () => void; onClose: () => void }) {
  const auth = useAuth();
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [activationCode, setActivationCode] = useState<ActivationCode>();
  const [errorMessage, setErrorMessage] = useState<string>();

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
      .then((response) => onActivate())
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
            <Alert color="error">{errorMessage}</Alert>
          </Box>
        )}

        {activationCode && (
          <Box>
            <pre>{JSON.stringify(activationCode, null, 2)} </pre>
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
        <Button variant="contained" color="success" onClick={handleActivate} disabled={!activationCode}>
          {t('activate')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
