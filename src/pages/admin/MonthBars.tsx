import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Tooltip } from '@mui/material';
import { MonthCount } from '../../api/admin-api-client';

/** Creations of the last months as small bars, the current month last; each bar tells its month and count. */
const MonthBars: FC<{ months: MonthCount[] }> = ({ months }) => {
  const { t } = useTranslation();
  const max = Math.max(1, ...months.map((entry) => entry.count));
  return (
    <Box role="img" aria-label={t('admin-created-by-month')} sx={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: 32, mt: 1.5 }}>
      {months.map((entry) => (
        <Tooltip key={entry.month} title={`${entry.month}: ${entry.count}`} placement="top" disableInteractive>
          <Box
            sx={{
              flex: 1,
              height: `${Math.max(8, (entry.count / max) * 100)}%`,
              borderRadius: 0.5,
              bgcolor: entry.count ? 'primary.main' : 'action.disabledBackground',
              opacity: entry.count ? 0.75 : 1,
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
};

export default MonthBars;
