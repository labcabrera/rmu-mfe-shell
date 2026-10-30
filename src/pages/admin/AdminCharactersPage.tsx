import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Chip, Stack, Typography } from '@mui/material';
import { Character, fetchCharacters } from '@labcabrera-rmu/rmu-react-shared-lib';
import AdminFilters from './AdminFilters';
import AdminTable, { AdminColumn } from './AdminTable';
import { containsRsql, rsqlOf, useAdminPage, useDebounced } from './useAdminPage';
import { useUserNames } from './useUserNames';

const STATUSES = ['created', 'partially_created', 'dead'];
const STATUS_COLORS: Record<string, 'success' | 'warning' | 'error'> = { created: 'success', partially_created: 'warning', dead: 'error' };

/** Characters of every user, with their campaign faction and owner. */
const AdminCharactersPage: FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const query = useDebounced(search);
  const { rows, total, page, setPage, loading } = useAdminPage<Character>(
    fetchCharacters,
    rsqlOf(containsRsql(query, 'name'), status && `status==${status}`)
  );
  const owners = useUserNames(rows.map((character) => character.owner));

  const columns: AdminColumn<Character>[] = [
    {
      key: 'name',
      label: t('name'),
      render: (character) => (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Avatar variant="rounded" src={character.imageUrl} alt="" sx={{ width: 32, height: 32 }}>
            {character.name.charAt(0)}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {character.name}
          </Typography>
        </Stack>
      ),
    },
    { key: 'faction', label: t('faction'), render: (character) => character.faction?.name ?? '—' },
    { key: 'race', label: t('race'), render: (character) => character.info?.race?.name ?? '—' },
    { key: 'profession', label: t('profession'), render: (character) => (character.info?.professionId ? t(character.info.professionId) : '—') },
    { key: 'level', label: t('level'), render: (character) => character.experience?.level ?? '—' },
    { key: 'owner', label: t('admin-owner'), render: (character) => (character.owner ? owners[character.owner] : '—') },
    {
      key: 'status',
      label: t('status'),
      render: (character) =>
        character.status ? (
          <Chip size="small" color={STATUS_COLORS[character.status]} label={t(`admin-character-status-${character.status}`)} />
        ) : (
          '—'
        ),
    },
  ];

  return (
    <>
      <AdminFilters
        search={search}
        onSearch={setSearch}
        status={{ value: status, onChange: setStatus, options: STATUSES.map((value) => ({ value, label: t(`admin-character-status-${value}`) })) }}
      />
      <AdminTable
        columns={columns}
        rows={rows}
        total={total}
        page={page}
        loading={loading}
        onPage={setPage}
        href={(character) => `/strategic/characters/view/${character.id}`}
      />
    </>
  );
};

export default AdminCharactersPage;
