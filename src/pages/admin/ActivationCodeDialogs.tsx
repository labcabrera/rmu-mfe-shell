import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ACTIVATION_CODES_CSV_HEADER, ACTIVATION_FEATURES, ActivationCode, userApiClient } from '../../api/user-api-client';

/** End of the day of a `YYYY-MM-DD` date field, as the ISO date the API takes. */
const endOfDay = (date: string): string | undefined => (date ? new Date(`${date}T23:59:59`).toISOString() : undefined);

/** Creates a batch of codes; on success it shows them, ready to copy or download as CSV. */
export const CreateActivationCodesDialog: FC<{ open: boolean; onClose: () => void; onCreated: () => void }> = ({ open, onClose, onCreated }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [features, setFeatures] = useState<string[]>(['core-law']);
  const [count, setCount] = useState(1);
  const [expires, setExpires] = useState('');
  const [note, setNote] = useState('');
  const [created, setCreated] = useState<ActivationCode[]>();
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const close = () => {
    setCreated(undefined);
    setError(undefined);
    onClose();
  };
  const create = () => {
    setSaving(true);
    setError(undefined);
    userApiClient
      .createActivationCodes({ features, count, expiresAt: endOfDay(expires), note: note.trim() || undefined }, auth)
      .then((codes) => {
        setCreated(codes);
        onCreated();
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setSaving(false));
  };
  const text = created?.map((code) => code.code).join('\n') ?? '';
  const download = () => {
    const rows = (created ?? []).map((code) => [code.code, code.features.join(' '), code.expiresAt ?? '', code.note ?? ''].join(';'));
    const blob = new Blob([[ACTIVATION_CODES_CSV_HEADER, ...rows].join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'activation-codes.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>{t('admin-create-codes')}</DialogTitle>
      <DialogContent>
        {created ? (
          <Stack spacing={2}>
            <Alert severity="success">{t('admin-codes-created', { count: created.length })}</Alert>
            <Box
              component="pre"
              sx={{ m: 0, p: 2, borderRadius: 1, bgcolor: 'action.hover', fontFamily: 'monospace', maxHeight: 280, overflow: 'auto' }}
            >
              {text}
            </Box>
            <Stack direction="row" spacing={1}>
              <Button startIcon={<ContentCopyIcon />} onClick={() => void navigator.clipboard?.writeText(text)}>
                {t('admin-copy-all')}
              </Button>
              <Button startIcon={<DownloadIcon />} onClick={download}>
                {t('admin-download-csv')}
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Box>
              <FormLabel>{t('admin-features')}</FormLabel>
              <FormGroup row>
                {ACTIVATION_FEATURES.map((feature) => (
                  <FormControlLabel
                    key={feature}
                    label={feature}
                    control={
                      <Checkbox
                        checked={features.includes(feature)}
                        onChange={() =>
                          setFeatures((current) => (current.includes(feature) ? current.filter((f) => f !== feature) : [...current, feature]))
                        }
                      />
                    }
                  />
                ))}
              </FormGroup>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                type="number"
                label={t('admin-count')}
                value={count}
                onChange={(event) => setCount(Math.max(1, Math.min(100, Number(event.target.value) || 1)))}
                slotProps={{ htmlInput: { min: 1, max: 100 } }}
              />
              <TextField
                type="date"
                label={t('admin-expires')}
                value={expires}
                onChange={(event) => setExpires(event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
            <TextField
              label={t('admin-note')}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              helperText={t('admin-note-help')}
              slotProps={{ htmlInput: { maxLength: 200 } }}
            />
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>{t(created ? 'close' : 'cancel')}</Button>
        {!created && (
          <Button variant="contained" onClick={create} disabled={saving || features.length === 0}>
            {t('admin-create')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

/** Changes the note and the expiry of a code. */
export const EditActivationCodeDialog: FC<{ code?: ActivationCode; onClose: () => void; onSaved: () => void }> = ({ code, onClose, onSaved }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [note, setNote] = useState(code?.note ?? '');
  const [expires, setExpires] = useState(code?.expiresAt ? code.expiresAt.slice(0, 10) : '');
  const [error, setError] = useState<string>();
  if (!code) return null;
  const save = () =>
    userApiClient
      .updateActivationCode(code.id, { note: note.trim() || null, expiresAt: endOfDay(expires), version: code.version }, auth)
      .then(() => {
        onSaved();
        onClose();
      })
      .catch((err: Error) => setError(err.message));
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <Typography component="span" sx={{ fontFamily: 'monospace', fontSize: 'inherit' }}>
          {code.code}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            type="date"
            label={t('admin-expires')}
            value={expires}
            onChange={(event) => setExpires(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label={t('admin-note')}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 200 } }}
          />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button variant="contained" onClick={save}>
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
