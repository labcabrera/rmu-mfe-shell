import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Chip, Stack, Typography } from '@mui/material';
import { ApiUser, userApiClient } from '../../api/user-api-client';
import AdminFilters from './AdminFilters';
import AdminTable, { AdminColumn } from './AdminTable';
import UserAdminDrawer from './UserAdminDrawer';
import { containsRsql, rsqlOf, useAdminPage, useDebounced } from './useAdminPage';

const fetchUsers = (rsql: string, page: number, size: number, auth: Parameters<typeof userApiClient.fetchUsers>[3]) =>
  userApiClient.fetchUsers(rsql, page, size, auth);

/** Every user with their groups and last sign-in; search by name or email. */
const AdminUsersPage: FC = () => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ApiUser>();
  const query = useDebounced(search);
  const { rows, setRows, total, page, setPage, loading } = useAdminPage<ApiUser>(fetchUsers, rsqlOf(containsRsql(query, 'name', 'email')));
  const date = (value?: string | Date | null) =>
    value ? new Date(value).toLocaleString(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  const columns: AdminColumn<ApiUser>[] = [
    {
      key: 'name',
      label: t('name'),
      render: (user) => (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Avatar src={user.imageUrl ?? undefined} alt="" sx={{ width: 32, height: 32 }}>
            {user.name.charAt(0)}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {user.name}
          </Typography>
        </Stack>
      ),
    },
    { key: 'email', label: t('email'), render: (user) => user.email ?? '—' },
    { key: 'provider', label: t('admin-provider'), render: (user) => user.identityProvider ?? '—' },
    {
      key: 'groups',
      label: t('admin-groups'),
      render: (user) => (
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {(user.features ?? []).map((group) => (
            <Chip key={group} size="small" label={group} color={group === 'rmu-admin' ? 'warning' : 'default'} variant="outlined" />
          ))}
        </Stack>
      ),
    },
    { key: 'last-login', label: t('last-login'), render: (user) => date(user.lastLoginAt) },
    { key: 'created', label: t('admin-created'), render: (user) => date(user.createdAt) },
    {
      key: 'enabled',
      label: t('admin-account'),
      render: (user) => (
        <Chip
          size="small"
          color={user.enabled === false ? 'error' : 'success'}
          label={t(user.enabled === false ? 'admin-disabled' : 'admin-enabled')}
        />
      ),
    },
  ];

  return (
    <>
      <AdminFilters search={search} onSearch={setSearch} />
      <AdminTable columns={columns} rows={rows} total={total} page={page} loading={loading} onPage={setPage} onRowClick={setSelected} />
      <UserAdminDrawer
        user={selected}
        onClose={() => setSelected(undefined)}
        onChanged={(updated) => {
          setSelected(updated);
          setRows((current) => current.map((row) => (row.id === updated.id ? updated : row)));
        }}
      />
    </>
  );
};

export default AdminUsersPage;
