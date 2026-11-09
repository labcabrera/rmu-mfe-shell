import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, LinearProgress } from '@mui/material';
import { DataTable, Panel } from '@labcabrera-rmu/rmu-react-shared-lib';

export type AdminColumn<T> = { key: string; label: string; render: (row: T) => ReactNode; width?: number | string };

export const ADMIN_PAGE_SIZE = 20;

/**
 * A server-paged table of the administration on the library DataTable (spec 066): a row with `href` opens it, a bar
 * shows the loading, and on a phone each row is a card.
 */
function AdminTable<T extends { id: string }>({
  columns,
  rows,
  total,
  page,
  loading,
  onPage,
  href,
  onRowClick,
}: {
  columns: AdminColumn<T>[];
  rows: T[];
  total: number;
  page: number;
  loading: boolean;
  onPage: (page: number) => void;
  href?: (row: T) => string;
  onRowClick?: (row: T) => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rowClick = href ? (row: T) => navigate(href(row)) : onRowClick;
  return (
    <Panel variant="outlined">
      <Box sx={{ minHeight: 4, mb: 0.5 }}>{loading && <LinearProgress />}</Box>
      <DataTable
        columns={columns.map((column) => ({ key: column.key, header: column.label, render: column.render, width: column.width }))}
        rows={rows}
        getKey={(row) => row.id}
        onRowClick={rowClick}
        emptyTitle={loading ? undefined : t('admin-no-results')}
        pagination={{ page, totalPages: Math.ceil(total / ADMIN_PAGE_SIZE), onPageChange: onPage, pageSize: ADMIN_PAGE_SIZE }}
      />
    </Panel>
  );
}

export default AdminTable;
