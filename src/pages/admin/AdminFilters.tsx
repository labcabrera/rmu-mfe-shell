import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField } from '@mui/material';
import { FilterBar, SearchField } from '@labcabrera-rmu/rmu-react-shared-lib';

/** Search box and an optional status select above an admin table. The pages debounce the search themselves. */
const AdminFilters: FC<{
  search: string;
  onSearch: (value: string) => void;
  status?: { value: string; options: { value: string; label: string }[]; onChange: (value: string) => void };
}> = ({ search, onSearch, status }) => {
  const { t } = useTranslation();
  return (
    <FilterBar activeCount={status?.value ? 1 : 0}>
      <SearchField value={search} onChange={onSearch} label={t('admin-search')} size="small" delay={0} />
      {status && (
        <TextField select fullWidth size="small" label={t('status')} value={status.value} onChange={(event) => status.onChange(event.target.value)}>
          <MenuItem value="">{t('all')}</MenuItem>
          {status.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    </FilterBar>
  );
};

export default AdminFilters;
