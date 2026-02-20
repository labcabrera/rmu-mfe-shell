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
  // Install a safe wrapper around document.requestStorageAccess early so
  // accidental calls outside of a user gesture don't throw noisy errors.
  try {
    if (typeof document !== 'undefined' && 'requestStorageAccess' in document) {
      const docAny = document as any;
      const native = docAny.requestStorageAccess && docAny.requestStorageAccess.bind(document);
      let lastUserGesture = 0;
      const userEvents = ['click', 'pointerdown', 'keydown', 'touchstart'];
      userEvents.forEach((ev) =>
        document.addEventListener(
          ev,
          () => {
            lastUserGesture = Date.now();
          },
          { capture: true }
        )
      );

      docAny.requestStorageAccess = function () {
        // allow native call if a user gesture was seen in the last 1s
        if (Date.now() - lastUserGesture < 1000 && typeof native === 'function') {
          try {
            return native();
          } catch (e) {
            return Promise.reject(e);
          }
        }
        return Promise.reject(new Error('requestStorageAccess requires a user gesture'));
      };
    }
  } catch (e) {
    // ignore wrapper install failures
  }
  try {
    // Silent SSO (check-sso) has been disabled due to browser storage access
    // restrictions and to avoid repeated `prompt=none` navigations. Perform a
    // standard init; interactive login will be triggered by the Login button.
    await KeycloakService.initKeycloak();
  } catch (e) {
    // non-blocking: still render app even if Keycloak init fails
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
