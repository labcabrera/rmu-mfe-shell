import React, { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { Container } from '@mui/material';
import { ErrorBoundary, LoadingState, NotFound } from '@labcabrera-rmu/rmu-react-shared-lib';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import MobileNav, { BOTTOM_NAV_HEIGHT } from './components/navigation/MobileNav';
import SideNav from './components/navigation/SideNav';
import { NavDrawerProvider } from './components/navigation/nav-drawer';
import { isImmersiveRoute } from './components/navigation/sections';
import RemoteBoundary from './components/remote/RemoteBoundary';
import RemoteUnavailable from './components/remote/RemoteUnavailable';
import HomePage from './pages/HomePage';
import SigninCallbackPage from './pages/SigninCallbackPage';
import AdminRoute from './pages/admin/AdminRoute';
import ProtectedRoute from './services/auth/ProtectedRoute';
import SessionRenewalNotice from './services/auth/SessionRenewalNotice';
import { ThemeSettingsProvider } from './theme/ThemeSettingsProvider';

// Workspace spec 091, E1: every page is its own chunk; the Suspense is in MfeRoot / the shell layout.
const UserProfile = lazy(() => import('./components/user/UserProfile'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const DocsPage = lazy(() => import('./pages/DocsPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const TechnicalInfoPage = lazy(() => import('./pages/TechnicalInfoPage'));
const AdminActivationCodesPage = lazy(() => import('./pages/admin/AdminActivationCodesPage'));
const AdminCharactersPage = lazy(() => import('./pages/admin/AdminCharactersPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminGamesPage = lazy(() => import('./pages/admin/AdminGamesPage'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminToolsPage = lazy(() => import('./pages/admin/AdminToolsPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const FriendInvitePage = lazy(() => import('./pages/FriendInvitePage'));

// A remote that fails to load only breaks its own route (see runtimeRemote in webpack.config.ts); one that
// fails while rendering is caught by RemoteBoundary.
const lazyRemote = (name: string, load: () => Promise<{ default: React.ComponentType }>) =>
  React.lazy(() =>
    load().catch((error) => {
      console.error(`[shell] Remote ${name} could not be loaded`, error);
      return { default: () => <RemoteUnavailable name={name} /> };
    })
  );

const RemoteCoreApp = lazyRemote('core', () => import('core/CoreApp'));
const RemoteStrategicApp = lazyRemote('strategic', () => import('strategic/StrategicApp'));
const RemoteTacticalApp = lazyRemote('tactical', () => import('tactical/TacticalApp'));
const RemoteNpcsApp = lazyRemote('npcs', () => import('npcs/NpcsApp'));
const RemoteItemsApp = lazyRemote('items', () => import('items/ItemsApp'));
const RemoteSpellsApp = lazyRemote('spells', () => import('spells/SpellsApp'));

// Every remote route needs a user: all their APIs (core, strategic, tactical, items, spells, npcs)
// guard their controllers with JwtAuthGuard. The home and static pages stay public.
const App = () => {
  const { pathname } = useLocation();

  return (
    <ThemeSettingsProvider>
      <NavDrawerProvider>
      <SessionRenewalNotice />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <Header />
        <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <SideNav />
          <Box
            component="main"
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              pb: { xs: `${BOTTOM_NAV_HEIGHT}px`, sm: 0 },
            }}
          >
            <Box sx={{ flex: 1 }}>
              {/* Workspace spec 091, F1: a page that breaks leaves the header and the navigation working. */}
              <ErrorBoundary resetKey={pathname}>
              <Suspense fallback={<LoadingState />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/legal" element={<LegalPage />} />
                  <Route path="/technical-info" element={<TechnicalInfoPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/docs" element={<DocsPage />} />
                  <Route path="/signin-callback" element={<SigninCallbackPage />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminLayout />
                      </AdminRoute>
                    }
                  >
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="games" element={<AdminGamesPage />} />
                    <Route path="characters" element={<AdminCharactersPage />} />
                    <Route path="activation-codes" element={<AdminActivationCodesPage />} />
                    <Route path="tools" element={<AdminToolsPage />} />
                  </Route>
                  <Route
                    path="/core/*"
                    element={
                      <ProtectedRoute>
                        <RemoteBoundary name="core">
                          <RemoteCoreApp />
                        </RemoteBoundary>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/strategic/*"
                    element={
                      <ProtectedRoute>
                        <RemoteBoundary name="strategic">
                          <RemoteStrategicApp />
                        </RemoteBoundary>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tactical/*"
                    element={
                      <ProtectedRoute>
                        <RemoteBoundary name="tactical">
                          <RemoteTacticalApp />
                        </RemoteBoundary>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/npcs/*"
                    element={
                      <ProtectedRoute>
                        <RemoteBoundary name="npcs">
                          <RemoteNpcsApp />
                        </RemoteBoundary>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/items/*"
                    element={
                      <ProtectedRoute>
                        <RemoteBoundary name="items">
                          <RemoteItemsApp />
                        </RemoteBoundary>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/spells/*"
                    element={
                      <ProtectedRoute>
                        <RemoteBoundary name="spells">
                          <RemoteSpellsApp />
                        </RemoteBoundary>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/friends/invite/:token"
                    element={
                      <ProtectedRoute>
                        <FriendInvitePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/user-profile"
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <Container maxWidth="xl" sx={{ py: 4 }}>
                        <NotFound />
                      </Container>
                    }
                  />
                </Routes>
              </Suspense>
              </ErrorBoundary>
            </Box>
            {/* Immersive pages (the combat board) need the whole height: no site footer under them. */}
            {!isImmersiveRoute(pathname) && <Footer />}
          </Box>
        </Box>
        <MobileNav />
      </Box>
      </NavDrawerProvider>
    </ThemeSettingsProvider>
  );
};

export default App;
