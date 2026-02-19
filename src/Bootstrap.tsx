import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './services/auth/AuthProvider';
import KeycloakService from './services/auth/KeycloakService';

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Missing root element with id "app"');
}

const root = ReactDOM.createRoot(rootElement as HTMLElement);

// Initialize Keycloak before mounting the app so remotes can read `window.RMU_AUTH`.
(async function initAndRender() {
  try {
    await KeycloakService.initKeycloak();
  } catch (e) {
    // non-blocking: still render app even if Keycloak init fails
    // console.warn('Keycloak init failed', e);
  }

  root.render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
})();
