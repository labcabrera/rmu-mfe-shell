import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme, LoadingState, NotFound } from '@labcabrera-rmu/rmu-react-shared-lib';
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

export type ThemeMode = 'light' | 'dark' | 'system';

const resolveThemeMode = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    try {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  }
  return mode;
};

const getStoredThemeMode = (): ThemeMode => {
  try {
    const stored = localStorage.getItem('themeMode');
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    return 'dark';
  } catch {
    return 'dark';
  }
};

const App = () => {
  const [themeMode, setThemeMode] = React.useState<ThemeMode>(getStoredThemeMode);
  const [systemTick, setSystemTick] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const theme = React.useMemo(() => createAppTheme(resolveThemeMode(themeMode)), [themeMode, systemTick]);

  // In "system" mode, follow the operating system when it switches between light and dark.
  React.useEffect(() => {
    if (themeMode !== 'system') return;
    const query = window.matchMedia?.('(prefers-color-scheme: light)');
    const onChange = () => setSystemTick((tick) => tick + 1);
    query?.addEventListener?.('change', onChange);
    return () => query?.removeEventListener?.('change', onChange);
  }, [themeMode]);

  const handleThemeModeChange = React.useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      localStorage.setItem('themeMode', mode);
    } catch {
      // Storage unavailable (private mode, blocked site data): the theme mode is just not remembered.
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
                        <UserProfile themeMode={themeMode} onThemeModeChange={handleThemeModeChange} />
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
    </ThemeProvider>
  );
};

export default App;
