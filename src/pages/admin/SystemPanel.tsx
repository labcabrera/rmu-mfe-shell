import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Card, Chip, Grid, Stack, Typography } from '@mui/material';
import { adminApiClient, ApiInfo, SYSTEM_APIS } from '../../api/admin-api-client';

type ApiStatus = { healthy?: boolean; info?: ApiInfo };

const uptime = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return days ? `${days}d ${hours}h` : `${hours}h ${Math.floor((seconds % 3600) / 60)}m`;
};

/** Health check and version of every API, as the gateway serves them to the browser. */
const SystemPanel: FC = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [status, setStatus] = useState<Record<string, ApiStatus>>({});

  useEffect(() => {
    let active = true;
    SYSTEM_APIS.forEach(({ name, uri }) => {
      Promise.all([adminApiClient.isHealthy(uri), adminApiClient.fetchInfo(uri, auth).catch(() => undefined)]).then(([healthy, info]) => {
        if (active) setStatus((current) => ({ ...current, [name]: { healthy, info } }));
      });
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Typography variant="overline" color="text.secondary">
        {t('admin-system')}
      </Typography>
      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        {SYSTEM_APIS.map(({ name }) => {
          const api = status[name];
          const checking = api === undefined;
          return (
            <Grid key={name} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
                <Chip
                  size="small"
                  color={checking ? 'default' : api.healthy ? 'success' : 'error'}
                  label={t(checking ? 'admin-health-checking' : api.healthy ? 'admin-health-up' : 'admin-health-down')}
                  sx={{ minWidth: 72 }}
                />
                <Stack sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                    {name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {api?.info ? `v${api.info.version} · ${t('admin-uptime')} ${uptime(api.info.uptimeSeconds)}` : '—'}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Card>
  );
};

export default SystemPanel;
