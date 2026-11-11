import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { SectionNav } from '@labcabrera-rmu/rmu-react-shared-lib';
import PageTitle from '../../components/PageTitle';

/** Pages of the administration, in the order of the tabs. */
const ADMIN_PAGES = [
  { label: 'admin-dashboard', href: '/admin' },
  { label: 'admin-users', href: '/admin/users' },
  { label: 'admin-games', href: '/admin/games' },
  { label: 'admin-characters', href: '/admin/characters' },
  { label: 'admin-activation-codes', href: '/admin/activation-codes' },
  { label: 'admin-tools', href: '/admin/tools' },
];

/** Frame of the administration: its title and a section per page (tabs, or a select on phones), driven by the route. */
const AdminLayout: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = [...ADMIN_PAGES].reverse().find((page) => pathname === page.href || pathname.startsWith(`${page.href}/`)) ?? ADMIN_PAGES[0];
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      <PageTitle sx={{ mb: 1 }}>{t('administration')}</PageTitle>
      <Box sx={{ mb: 3, borderBottom: { sm: 1 }, borderColor: 'divider' }}>
        <SectionNav
          label={t('administration')}
          sections={ADMIN_PAGES.map((page) => ({ id: page.href, label: t(page.label) }))}
          value={current.href}
          onChange={(href) => navigate(href)}
        />
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Container>
  );
};

export default AdminLayout;
