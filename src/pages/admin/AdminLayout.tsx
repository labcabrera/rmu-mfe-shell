import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';

/** Pages of the administration, in the order of the tabs. */
export const ADMIN_PAGES = [
  { label: 'admin-dashboard', href: '/admin' },
  { label: 'admin-users', href: '/admin/users' },
  { label: 'admin-games', href: '/admin/games' },
  { label: 'admin-characters', href: '/admin/characters' },
];

/** Frame of the administration: its title and a tab per page. */
const AdminLayout: FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const current = [...ADMIN_PAGES].reverse().find((page) => pathname === page.href || pathname.startsWith(`${page.href}/`));
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ fontFamily: (theme) => theme.fonts.display, fontWeight: 600, mb: 1 }}>
        {t('administration')}
      </Typography>
      <Tabs value={current?.href ?? false} variant="scrollable" allowScrollButtonsMobile sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        {ADMIN_PAGES.map((page) => (
          <Tab key={page.href} value={page.href} label={t(page.label)} component={RouterLink} to={page.href} />
        ))}
      </Tabs>
      <Box>
        <Outlet />
      </Box>
    </Container>
  );
};

export default AdminLayout;
