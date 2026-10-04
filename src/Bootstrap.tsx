import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { i18n, initI18n } from './i18n/i18n';
import AuthProvider from './services/auth/AuthProvider';
import { ApiUserProvider } from './services/user/ApiUserProvider';

const mount = async () => {
  const locale = localStorage.getItem('locale') || undefined;
  await initI18n(locale);
  createRoot(document.getElementById('app')!).render(
    <StrictMode>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <ApiUserProvider>
              <App />
            </ApiUserProvider>
          </AuthProvider>
        </I18nextProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

mount();
