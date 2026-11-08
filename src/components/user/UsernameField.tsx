import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { ApiError } from '../../api/user-api-client';
import { useApiUser } from '../../services/user/ApiUserProvider';

// The same rule as the display name of rmu-api-users.
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 32;
const USERNAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} ._-]*$/u;

const isValidUsername = (name: string) => name.length >= USERNAME_MIN_LENGTH && name.length <= USERNAME_MAX_LENGTH && USERNAME_PATTERN.test(name);

/**
 * The name of the user in RMU, the one friends find them by, with its inline edition; `fallback` shows until it loads. It is not the account name they
 * sign in with, which stays in the identity provider.
 */
export default function UsernameField({ fallback }: { fallback: string }) {
  const { t } = useTranslation();
  const { apiUser, updateApiUser } = useApiUser();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  if (!apiUser) return <Typography variant="h5">{fallback}</Typography>;

  const close = () => {
    setDraft(null);
    setError(undefined);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    const name = (draft ?? '').trim();
    if (name === apiUser.name) {
      close();
      return;
    }
    if (!isValidUsername(name)) {
      setError(t('username-invalid', { min: USERNAME_MIN_LENGTH, max: USERNAME_MAX_LENGTH }));
      return;
    }
    setSaving(true);
    setError(undefined);
    updateApiUser({ name })
      .then(close)
      .catch((err: Error) => setError(err instanceof ApiError && err.status === 409 ? t('username-taken') : err.message))
      .finally(() => setSaving(false));
  };

  if (draft === null) {
    return (
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <Typography variant="h5">{apiUser.name}</Typography>
        <Tooltip title={t('username-edit')}>
          <IconButton size="small" aria-label={t('username-edit')} onClick={() => setDraft(apiUser.name)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    );
  }

  return (
    <Stack component="form" direction="row" spacing={0.5} sx={{ alignItems: 'flex-start' }} onSubmit={save}>
      <TextField
        autoFocus
        size="small"
        label={t('username')}
        value={draft}
        disabled={saving}
        error={!!error}
        helperText={error ?? t('username-help')}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => event.key === 'Escape' && close()}
        slotProps={{ htmlInput: { maxLength: USERNAME_MAX_LENGTH } }}
        sx={{ width: 320, maxWidth: '100%' }}
      />
      <Tooltip title={t('save')}>
        <span>
          <IconButton type="submit" color="primary" aria-label={t('save')} disabled={saving}>
            <CheckIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={t('cancel')}>
        <span>
          <IconButton aria-label={t('cancel')} disabled={saving} onClick={close}>
            <CloseIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
