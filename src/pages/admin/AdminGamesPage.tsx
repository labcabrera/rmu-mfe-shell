import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Chip, Tab, Tabs } from '@mui/material';
import { fetchStrategicGames, fetchTacticalGames, StrategicGame, TacticalGame } from '@labcabrera-rmu/rmu-react-shared-lib';
import AdminFilters from './AdminFilters';
import AdminTable, { AdminColumn } from './AdminTable';
import { containsRsql, rsqlOf, useAdminPage, useDebounced } from './useAdminPage';
import { useUserNames } from './useUserNames';

const CAMPAIGN_STATUSES = ['open', 'closed'];
const TACTICAL_STATUSES = ['created', 'in_progress', 'finished'];

/** Campaigns of every user. */
const CampaignsTable: FC<{ query: string; status: string }> = ({ query, status }) => {
  const { t } = useTranslation();
  const { rows, total, page, setPage, loading } = useAdminPage<StrategicGame>(
    fetchStrategicGames,
    rsqlOf(containsRsql(query, 'name'), status && `status==${status}`)
  );
  const owners = useUserNames(rows.map((game) => game.owner));
  const columns: AdminColumn<StrategicGame>[] = [
    { key: 'name', label: t('name'), render: (game) => game.name },
    { key: 'realm', label: t('realm'), render: (game) => game.realmName },
    { key: 'owner', label: t('admin-owner'), render: (game) => owners[game.owner] },
    {
      key: 'status',
      label: t('status'),
      render: (game) => <Chip size="small" label={t(game.status)} color={game.status === 'open' ? 'success' : 'default'} />,
    },
  ];
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      loading={loading}
      onPage={setPage}
      href={(game) => `/strategic/games/view/${game.id}`}
    />
  );
};

/** Tactical games of every user, newest first. */
const TacticalTable: FC<{ query: string; status: string }> = ({ query, status }) => {
  const { t } = useTranslation();
  const { rows, total, page, setPage, loading } = useAdminPage<TacticalGame>(
    (rsql, p, size, auth) => fetchTacticalGames(rsql, p, size, auth, '-createdAt'),
    rsqlOf(containsRsql(query, 'name'), status && `status==${status}`)
  );
  const owners = useUserNames(rows.map((game) => game.owner));
  const columns: AdminColumn<TacticalGame>[] = [
    { key: 'name', label: t('name'), render: (game) => game.name },
    { key: 'owner', label: t('admin-owner'), render: (game) => owners[game.owner] },
    { key: 'round', label: t('round'), render: (game) => game.round },
    { key: 'actors', label: t('actors'), render: (game) => game.actors?.length ?? 0 },
    {
      key: 'status',
      label: t('status'),
      render: (game) => (
        <Chip size="small" label={t(`tactical-game-status-${game.status}`)} color={game.status === 'in_progress' ? 'success' : 'default'} />
      ),
    },
  ];
  return (
    <AdminTable
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      loading={loading}
      onPage={setPage}
      href={(game) => `/tactical/games/view/${game.id}`}
    />
  );
};

/** Campaigns and tactical games of every user, in two tabs (`?tab=tactical`). */
const AdminGamesPage: FC = () => {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'tactical' ? 'tactical' : 'campaigns';
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const query = useDebounced(search);
  const statuses = tab === 'tactical' ? TACTICAL_STATUSES : CAMPAIGN_STATUSES;

  return (
    <>
      <Tabs
        value={tab}
        onChange={(_, next: string) => {
          setStatus('');
          setParams(next === 'tactical' ? { tab: next } : {});
        }}
        sx={{ mb: 2 }}
      >
        <Tab value="campaigns" label={t('strategic-games')} />
        <Tab value="tactical" label={t('tactical-games')} />
      </Tabs>
      <AdminFilters
        search={search}
        onSearch={setSearch}
        status={{
          value: status,
          onChange: setStatus,
          options: statuses.map((value) => ({ value, label: t(tab === 'tactical' ? `tactical-game-status-${value}` : value) })),
        }}
      />
      {tab === 'tactical' ? <TacticalTable query={query} status={status} /> : <CampaignsTable query={query} status={status} />}
    </>
  );
};

export default AdminGamesPage;
