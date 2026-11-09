import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Alert, Box, Grid, Typography } from '@mui/material';
import { hoverLiftSx, Panel } from '@labcabrera-rmu/rmu-react-shared-lib';
import { ADMIN_TOOLS } from '../../api/admin-api-client';

/** Links to the operation tools of the environment: only those whose RMU_ADMIN_*_URI is set. */
const AdminToolsPage: FC = () => {
  const { t } = useTranslation();
  if (ADMIN_TOOLS.length === 0) return <Alert severity="info">{t('admin-tools-none')}</Alert>;
  return (
    <Grid container spacing={2}>
      {ADMIN_TOOLS.map((tool) => (
        <Grid key={tool.key} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Box
            component="a"
            href={tool.uri}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: 'block', height: '100%', color: 'inherit', textDecoration: 'none' }}
          >
            <Panel
              variant="outlined"
              title={t(`admin-tool-${tool.key}`)}
              extra={<OpenInNewIcon fontSize="small" color="action" />}
              sx={[{ height: '100%' }, hoverLiftSx]}
            >
              <Typography variant="body2" color="text.secondary">
                {t(`admin-tool-${tool.key}-description`)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, wordBreak: 'break-all' }}>
                {tool.uri}
              </Typography>
            </Panel>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default AdminToolsPage;
