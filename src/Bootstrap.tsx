import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { createRmuQueryClient } from '@labcabrera-rmu/rmu-react-shared-lib';
import { QueryClientProvider } from '@tanstack/react-query';
import '@fontsource-variable/inter';
import '@fontsource/cinzel/600.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import App from './App';
import { i18n, initI18n } from './i18n/i18n';
import AuthProvider from './services/auth/AuthProvider';
import { ApiUserProvider } from './services/user/ApiUserProvider';
import { showStartupFailure } from './startup-failure';

const queryClient = createRmuQueryClient();

const mount = async () => {
  const locale = localStorage.getItem('locale') || undefined;
  await initI18n(locale);
  createRoot(document.getElementById('app')!).render(
    <StrictMode>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <ApiUserProvider>
                <App />
              </ApiUserProvider>
            </QueryClientProvider>
          </AuthProvider>
        </I18nextProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

mount().catch(showStartupFailure);
