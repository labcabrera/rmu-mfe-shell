import React, { ElementType, FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import ImageIcon from '@mui/icons-material/Image';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import { Box, Card, CardActionArea, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { enterSx } from '@labcabrera-rmu/rmu-react-shared-lib';
import { CollectionStats, MonthCount } from '../../api/admin-api-client';
import MonthBars from './MonthBars';
import SystemPanel from './SystemPanel';
import { useAdminStats } from './useAdminStats';

type Breakdown = { key: string; label: string; value?: number | string };
type Tile = { title: string; icon: ElementType; href?: string; total?: number; breakdown: Breakdown[]; months?: MonthCount[] };

const byStatus = (stats: CollectionStats | undefined, statuses: string[], label: (status: string) => string): Breakdown[] =>
  statuses.map((status) => ({ key: status, label: label(status), value: stats && (stats.byStatus?.[status] ?? 0) }));

const megabytes = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/** A tile opens its page when it has one. */
const TileArea: FC<{ href?: string; children: ReactNode }> = ({ href, children }) => {
  const sx = { height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'stretch' } as const;
  return href ? (
    <CardActionArea component={RouterLink} to={href} sx={sx}>
      {children}
    </CardActionArea>
  ) : (
    <Box sx={sx}>{children}</Box>
  );
};

/**
 * First page of the administration: users, campaigns, games, characters, codes and images with their breakdown and the
 * creations of the last 12 months (GET /v1/stats of each API), and the state of every API.
 */
const AdminDashboardPage: FC = () => {
  const { t } = useTranslation();
  const { stats, loading } = useAdminStats();
  const { strategic, tactical, users, media } = stats;
  const codes = users?.activationCodes;
  const tiles: Tile[] = [
    {
      title: 'admin-users',
      icon: GroupIcon,
      href: '/admin/users',
      total: users?.users.total,
      months: users?.users.createdByMonth,
      breakdown: [
        { key: 'active', label: t('admin-users-active'), value: users?.users.active },
        { key: 'new', label: t('admin-users-new-this-month'), value: users?.users.newThisMonth },
      ],
    },
    {
      title: 'strategic-games',
      icon: PublicIcon,
      href: '/admin/games',
      total: strategic?.campaigns.total,
      months: strategic?.campaigns.createdByMonth,
      breakdown: byStatus(strategic?.campaigns, ['open', 'closed'], (status) => t(status)),
    },
    {
      title: 'tactical-games',
      icon: SportsKabaddiIcon,
      href: '/admin/games?tab=tactical',
      total: tactical?.games.total,
      months: tactical?.games.createdByMonth,
      breakdown: byStatus(tactical?.games, ['in_progress', 'created', 'finished'], (status) => t(`tactical-game-status-${status}`)),
    },
    {
      title: 'characters',
      icon: PersonIcon,
      href: '/admin/characters',
      total: strategic?.characters.total,
      months: strategic?.characters.createdByMonth,
      breakdown: byStatus(strategic?.characters, ['created', 'partially_created', 'dead'], (status) => t(`admin-character-status-${status}`)),
    },
    {
      title: 'admin-activation-codes',
      icon: KeyIcon,
      href: '/admin/activation-codes',
      total: codes?.total,
      breakdown: [
        { key: 'free', label: t('admin-code-free'), value: codes?.free },
        { key: 'used', label: t('admin-code-used'), value: codes?.used },
        { key: 'expired', label: t('admin-codes-expired'), value: codes?.expired },
      ],
    },
    {
      title: 'admin-images',
      icon: ImageIcon,
      total: media?.images.total,
      months: media?.images.createdByMonth,
      breakdown: [{ key: 'size', label: t('admin-images-size'), value: media && megabytes(media.images.sizeBytes) }],
    },
  ];

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        {tiles.map((tile, index) => {
          const Icon = tile.icon;
          return (
            <Grid key={tile.title} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card variant="outlined" sx={[{ height: '100%' }, enterSx(index)]}>
                <TileArea href={tile.href}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'text.secondary' }}>
                    <Icon fontSize="small" color="primary" />
                    <Typography variant="overline">{t(tile.title)}</Typography>
                  </Stack>
                  {loading ? (
                    <Skeleton variant="text" width={80} sx={{ fontSize: '2.5rem' }} />
                  ) : (
                    <Typography variant="h3" component="p" sx={{ fontFamily: (theme) => theme.fonts.display, fontWeight: 600 }}>
                      {tile.total ?? '—'}
                    </Typography>
                  )}
                  <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                    {tile.breakdown.map((entry) => (
                      <Chip key={entry.key} size="small" variant="outlined" label={`${entry.label}: ${loading ? '…' : (entry.value ?? '—')}`} />
                    ))}
                  </Stack>
                  {tile.months && <MonthBars months={tile.months} />}
                </TileArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <SystemPanel />
    </Stack>
  );
};

export default AdminDashboardPage;
