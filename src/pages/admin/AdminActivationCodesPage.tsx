import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Alert, Button, Chip, IconButton, Stack, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { ActivationCode, userApiClient } from '../../api/user-api-client';
import { CreateActivationCodesDialog, EditActivationCodeDialog } from './ActivationCodeDialogs';
import AdminTable, { AdminColumn } from './AdminTable';
import { useAdminPage } from './useAdminPage';
import { useUserNames } from './useUserNames';

const FILTERS: Record<string, string> = { free: 'activatedAt==null', used: 'activatedAt!=null', all: '' };

const fetchCodes = (rsql: string, page: number, size: number, auth: Parameters<typeof userApiClient.fetchActivationCodes>[3]) =>
  userApiClient.fetchActivationCodes(rsql, page, size, auth);

/** Activation codes: create them in batches, see who used each one, revoke the free ones and release the used ones. */
const AdminActivationCodesPage: FC = () => {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const [filter, setFilter] = useState('free');
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<ActivationCode>();
  const [error, setError] = useState<string>();
  const { rows, total, page, setPage, loading, reload } = useAdminPage<ActivationCode>(fetchCodes, FILTERS[filter]);
  const names = useUserNames(rows.flatMap((code) => [code.owner, code.activatedBy ?? undefined]));
  const date = (value?: string | null) => (value ? new Date(value).toLocaleDateString(i18n.language, { dateStyle: 'medium' }) : '—');
  const expired = (code: ActivationCode) => !code.activatedAt && !!code.expiresAt && new Date(code.expiresAt).getTime() < Date.now();

  const act = (action: Promise<unknown>) => action.then(reload).catch((err: Error) => setError(err.message));
  const remove = (code: ActivationCode) =>
    window.confirm(t('admin-confirm-delete-code', { code: code.code })) && act(userApiClient.deleteActivationCode(code.id, auth));
  const release = (code: ActivationCode) =>
    window.confirm(t('admin-confirm-release-code', { code: code.code })) &&
    act(userApiClient.updateActivationCode(code.id, { activatedAt: null, version: code.version }, auth));

  const columns: AdminColumn<ActivationCode>[] = [
    {
      key: 'code',
      label: t('admin-code'),
      render: (code) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
          {code.code}
        </Typography>
      ),
    },
    {
      key: 'features',
      label: t('admin-features'),
      render: (code) => (
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {code.features.map((feature) => (
            <Chip key={feature} size="small" variant="outlined" label={feature} />
          ))}
        </Stack>
      ),
    },
    { key: 'note', label: t('admin-note'), render: (code) => code.note ?? '—' },
    { key: 'created', label: t('admin-created-by'), render: (code) => `${code.owner ? names[code.owner] : '—'} · ${date(code.createdAt)}` },
    {
      key: 'state',
      label: t('status'),
      render: (code) =>
        code.activatedAt ? (
          <Stack spacing={0.25}>
            <Chip size="small" color="success" label={t('admin-code-used')} sx={{ alignSelf: 'flex-start' }} />
            <Typography variant="caption" color="text.secondary">
              {`${code.activatedBy ? names[code.activatedBy] : '—'} · ${date(code.activatedAt)}`}
            </Typography>
          </Stack>
        ) : expired(code) ? (
          <Chip size="small" color="error" label={t('admin-code-expired')} />
        ) : (
          <Stack spacing={0.25}>
            <Chip size="small" color="info" label={t('admin-code-free')} sx={{ alignSelf: 'flex-start' }} />
            {code.expiresAt && (
              <Typography variant="caption" color="text.secondary">
                {t('admin-code-expires-on', { date: date(code.expiresAt) })}
              </Typography>
            )}
          </Stack>
        ),
    },
    {
      key: 'actions',
      label: '',
      render: (code) => (
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Tooltip title={t('edit')}>
            <IconButton size="small" onClick={() => setEditing(code)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {code.activatedAt ? (
            <Tooltip title={t('admin-release-code')}>
              <IconButton size="small" onClick={() => release(code)}>
                <LockOpenIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={t('admin-revoke-code')}>
              <IconButton size="small" color="error" onClick={() => remove(code)}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2, alignItems: { sm: 'center' } }}>
        <Tabs value={filter} onChange={(_, next: string) => setFilter(next)} sx={{ flex: 1 }}>
          <Tab value="free" label={t('admin-code-free')} />
          <Tab value="used" label={t('admin-code-used')} />
          <Tab value="all" label={t('all')} />
        </Tabs>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreating(true)} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}>
          {t('admin-create-codes')}
        </Button>
      </Stack>
      {error && (
        <Alert severity="error" onClose={() => setError(undefined)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <AdminTable columns={columns} rows={rows} total={total} page={page} loading={loading} onPage={setPage} />
      <CreateActivationCodesDialog open={creating} onClose={() => setCreating(false)} onCreated={reload} />
      <EditActivationCodeDialog key={editing?.id} code={editing} onClose={() => setEditing(undefined)} onSaved={reload} />
    </>
  );
};

export default AdminActivationCodesPage;
