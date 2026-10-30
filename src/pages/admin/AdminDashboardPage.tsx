import React, { ElementType, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import { Card, CardActionArea, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { enterSx } from '@labcabrera-rmu/rmu-react-shared-lib';
import { CountQuery, useAdminCounts } from './useAdminCounts';

type Breakdown = { key: string; label: string };
type Tile = { title: string; icon: ElementType; href: string; total: string; breakdown: Breakdown[] };

const QUERIES: CountQuery[] = [
  { key: 'users', counter: 'users', rsql: '' },
  { key: 'campaigns', counter: 'campaigns', rsql: '' },
  { key: 'campaigns-open', counter: 'campaigns', rsql: 'status==open' },
  { key: 'campaigns-closed', counter: 'campaigns', rsql: 'status==closed' },
  { key: 'tactical', counter: 'tactical', rsql: '' },
  { key: 'tactical-created', counter: 'tactical', rsql: 'status==created' },
  { key: 'tactical-in_progress', counter: 'tactical', rsql: 'status==in_progress' },
  { key: 'tactical-finished', counter: 'tactical', rsql: 'status==finished' },
  { key: 'characters', counter: 'characters', rsql: '' },
  { key: 'characters-created', counter: 'characters', rsql: 'status==created' },
  { key: 'characters-partially_created', counter: 'characters', rsql: 'status==partially_created' },
  { key: 'characters-dead', counter: 'characters', rsql: 'status==dead' },
];

/** First page of the administration: how many users, campaigns, games and characters there are, by state. */
const AdminDashboardPage: FC = () => {
  const { t } = useTranslation();
  const { counts, loading } = useAdminCounts(QUERIES);
  const tiles: Tile[] = [
    { title: 'admin-users', icon: GroupIcon, href: '/admin/users', total: 'users', breakdown: [] },
    {
      title: 'strategic-games',
      icon: PublicIcon,
      href: '/admin/games',
      total: 'campaigns',
      breakdown: ['open', 'closed'].map((status) => ({ key: `campaigns-${status}`, label: t(status) })),
    },
    {
      title: 'tactical-games',
      icon: SportsKabaddiIcon,
      href: '/admin/games?tab=tactical',
      total: 'tactical',
      breakdown: ['in_progress', 'created', 'finished'].map((status) => ({ key: `tactical-${status}`, label: t(`tactical-game-status-${status}`) })),
    },
    {
      title: 'characters',
      icon: PersonIcon,
      href: '/admin/characters',
      total: 'characters',
      breakdown: ['created', 'partially_created', 'dead'].map((status) => ({
        key: `characters-${status}`,
        label: t(`admin-character-status-${status}`),
      })),
    },
  ];

  return (
    <Grid container spacing={2}>
      {tiles.map((tile, index) => {
        const Icon = tile.icon;
        return (
          <Grid key={tile.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card variant="outlined" sx={[{ height: '100%' }, enterSx(index)]}>
              <CardActionArea
                component={RouterLink}
                to={tile.href}
                sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'text.secondary' }}>
                  <Icon fontSize="small" color="primary" />
                  <Typography variant="overline">{t(tile.title)}</Typography>
                </Stack>
                {loading ? (
                  <Skeleton variant="text" width={80} sx={{ fontSize: '2.5rem' }} />
                ) : (
                  <Typography variant="h3" component="p" sx={{ fontFamily: (theme) => theme.fonts.display, fontWeight: 600 }}>
                    {counts[tile.total] ?? '—'}
                  </Typography>
                )}
                <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                  {tile.breakdown.map((entry) => (
                    <Chip key={entry.key} size="small" variant="outlined" label={`${entry.label}: ${loading ? '…' : (counts[entry.key] ?? '—')}`} />
                  ))}
                </Stack>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default AdminDashboardPage;
