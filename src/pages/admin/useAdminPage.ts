import { useEffect, useState } from 'react';
import { AuthContextProps, useAuth } from 'react-oidc-context';
import { ADMIN_PAGE_SIZE } from './AdminTable';

type Fetcher<T> = (
  rsql: string,
  page: number,
  size: number,
  auth: AuthContextProps
) => Promise<{ content: T[]; pagination: { totalElements: number } }>;

/** One page of a list of the administration for an RSQL filter; going back to the first page when the filter changes. */
export function useAdminPage<T>(fetcher: Fetcher<T>, rsql: string) {
  const auth = useAuth();
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloads, setReloads] = useState(0);

  useEffect(() => setPage(0), [rsql]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetcher(rsql, page, ADMIN_PAGE_SIZE, auth)
      .then((result) => {
        if (!active) return;
        setRows(result.content);
        setTotal(result.pagination.totalElements);
        setError(false);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rsql, page, reloads]);

  return { rows, setRows, total, page, setPage, loading, error, reload: () => setReloads((n) => n + 1) };
}

/** RSQL of the filters that have a value, joined with `;` (and). */
export const rsqlOf = (...parts: (string | false | undefined)[]): string => parts.filter(Boolean).join(';');

/** Case-insensitive "contains" on one or more fields (`=re=` escapes the text in the APIs). */
export const containsRsql = (text: string, ...fields: string[]): string | undefined => {
  const value = text.trim().replace(/["\\&#%?+]/g, '');
  if (!value) return undefined;
  const parts = fields.map((field) => `${field}=re="${value}"`);
  return parts.length > 1 ? `(${parts.join(',')})` : parts[0];
};

/** `value` once it has stopped changing for `ms` (search boxes). */
export function useDebounced<T>(value: T, ms = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(timer);
  }, [value, ms]);
  return debounced;
}
