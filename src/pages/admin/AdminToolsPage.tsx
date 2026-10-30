import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Alert, Card, CardActionArea, Grid, Stack, Typography } from '@mui/material';
import { ADMIN_TOOLS } from '../../api/admin-api-client';

/** Links to the operation tools of the environment: only those whose RMU_ADMIN_*_URI is set. */
const AdminToolsPage: FC = () => {
  const { t } = useTranslation();
  if (ADMIN_TOOLS.length === 0) return <Alert severity="info">{t('admin-tools-none')}</Alert>;
  return (
    <Grid container spacing={2}>
      {ADMIN_TOOLS.map((tool) => (
        <Grid key={tool.key} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardActionArea component="a" href={tool.uri} target="_blank" rel="noopener noreferrer" sx={{ height: '100%', p: 2 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {t(`admin-tool-${tool.key}`)}
                </Typography>
                <OpenInNewIcon fontSize="small" color="action" />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {t(`admin-tool-${tool.key}-description`)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, wordBreak: 'break-all' }}>
                {tool.uri}
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AdminToolsPage;
