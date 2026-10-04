import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
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
import createAppTheme from './theme';

const RemoteCoreApp = React.lazy(() => import('core/CoreApp'));
const RemoteStrategicApp = React.lazy(() => import('strategic/StrategicApp'));
const RemoteTacticalApp = React.lazy(() => import('tactical/TacticalApp'));
const RemoteNpcsApp = React.lazy(() => import('npcs/NpcsApp'));
const RemoteItemsApp = React.lazy(() => import('items/ItemsApp'));
const RemoteSpellsApp = React.lazy(() => import('spells/SpellsApp'));

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
  const theme = React.useMemo(() => createAppTheme(resolveThemeMode(themeMode)), [themeMode]);

  const handleThemeModeChange = React.useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      localStorage.setItem('themeMode', mode);
    } catch {}
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
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
          <Route path="/core/*" element={<RemoteCoreApp />} />
          <Route path="/strategic/*" element={<RemoteStrategicApp />} />
          <Route path="/tactical/*" element={<RemoteTacticalApp />} />
          <Route path="/npcs/*" element={<RemoteNpcsApp />} />
          <Route path="/items/*" element={<RemoteItemsApp />} />
          <Route path="/spells/*" element={<RemoteSpellsApp />} />
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute>
                <UserProfile themeMode={themeMode} onThemeModeChange={handleThemeModeChange} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div>404 Page not found!</div>} />
        </Routes>
      </Suspense>
      <Footer />
    </ThemeProvider>
  );
};

export default App;
