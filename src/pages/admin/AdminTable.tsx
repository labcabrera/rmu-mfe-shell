import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';

export type AdminColumn<T> = { key: string; label: string; render: (row: T) => ReactNode; width?: number | string };

export const ADMIN_PAGE_SIZE = 20;

/**
 * A server-paged table of the administration. A row with `href` opens it; on a phone the table scrolls sideways
 * instead of squeezing its columns.
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
  return (
    <Card variant="outlined">
      {loading && <LinearProgress />}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key} sx={{ width: column.width }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={href ? () => navigate(href(row)) : onRowClick && (() => onRowClick(row))}
                sx={{ cursor: href || onRowClick ? 'pointer' : undefined }}
              >
                {columns.map((column) => (
                  <TableCell key={column.key}>{column.render(row)}</TableCell>
                ))}
              </TableRow>
            ))}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    {t('admin-no-results')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={ADMIN_PAGE_SIZE}
        rowsPerPageOptions={[ADMIN_PAGE_SIZE]}
        onPageChange={(_, next) => onPage(next)}
      />
    </Card>
  );
}

export default AdminTable;
