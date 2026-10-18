import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { LoadingState, NotFound } from '@labcabrera-rmu/rmu-react-shared-lib';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import MobileNav, { BOTTOM_NAV_HEIGHT } from './components/navigation/MobileNav';
import SideNav from './components/navigation/SideNav';
import RemoteBoundary from './components/remote/RemoteBoundary';
import RemoteUnavailable from './components/remote/RemoteUnavailable';
import UserProfile from './components/user/UserProfile';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DocsPage from './pages/DocsPage';
import HomePage from './pages/HomePage';
import LegalPage from './pages/LegalPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RegisterPage from './pages/RegisterPage';
import SigninCallbackPage from './pages/SigninCallbackPage';
import TechnicalInfoPage from './pages/TechnicalInfoPage';
import ProtectedRoute from './services/auth/ProtectedRoute';
import { ThemeSettingsProvider } from './theme/ThemeSettingsProvider';

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

const App = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <ThemeSettingsProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <Header onMenuClick={() => setDrawerOpen(true)} />
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
                    path="/core/*"
                    element={
                      <RemoteBoundary name="core">
                        <RemoteCoreApp />
                      </RemoteBoundary>
                    }
                  />
                  <Route
                    path="/strategic/*"
                    element={
                      <RemoteBoundary name="strategic">
                        <RemoteStrategicApp />
                      </RemoteBoundary>
                    }
                  />
                  <Route
                    path="/tactical/*"
                    element={
                      <RemoteBoundary name="tactical">
                        <RemoteTacticalApp />
                      </RemoteBoundary>
                    }
                  />
                  <Route
                    path="/npcs/*"
                    element={
                      <RemoteBoundary name="npcs">
                        <RemoteNpcsApp />
                      </RemoteBoundary>
                    }
                  />
                  <Route
                    path="/items/*"
                    element={
                      <RemoteBoundary name="items">
                        <RemoteItemsApp />
                      </RemoteBoundary>
                    }
                  />
                  <Route
                    path="/spells/*"
                    element={
                      <RemoteBoundary name="spells">
                        <RemoteSpellsApp />
                      </RemoteBoundary>
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
            </Box>
            <Footer />
          </Box>
        </Box>
        <MobileNav drawerOpen={drawerOpen} onDrawerChange={setDrawerOpen} />
      </Box>
    </ThemeSettingsProvider>
  );
};

export default App;
