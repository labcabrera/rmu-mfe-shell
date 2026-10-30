import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';

/** Search box and an optional status select above an admin table. */
const AdminFilters: FC<{
  search: string;
  onSearch: (value: string) => void;
  status?: { value: string; options: { value: string; label: string }[]; onChange: (value: string) => void };
}> = ({ search, onSearch, status }) => {
  const { t } = useTranslation();
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
      <TextField
        size="small"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        placeholder={t('admin-search')}
        sx={{ minWidth: { sm: 280 } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
      {status && (
        <TextField
          select
          size="small"
          label={t('status')}
          value={status.value}
          onChange={(event) => status.onChange(event.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">{t('all')}</MenuItem>
          {status.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Stack>
  );
};

export default AdminFilters;
