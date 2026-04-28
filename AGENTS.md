# AGENTS — MFE Shell (rmu-mfe-shell)

## Project summary

This repository is the shell for a Micro Frontend (MFE) architecture.
The shell orchestrates and federates a set of microfrontends using Webpack Module Federation.
Each microfrontend is built with React and can be loaded as a remote at runtime or included at build time depending on configuration.

The shell provides OIDC authentication, i18n support, UI templates/base components, and core application pieces such as header, user management, and footer.

## Key entry points

- App bootstrap: [src/Bootstrap.tsx](src/Bootstrap.tsx)
- Main app entry: [src/index.js](src/index.js)
- Webpack / Module Federation config: [webpack.config.ts](webpack.config.ts)
- Scripts and commands: [package.json](package.json)

## Module Federation strategy

- The shell uses `ModuleFederationPlugin` to declare `remotes` (e.g., `core`, `strategic`, `tactical`, `npcs`).
- Recommendation: use a runtime `remotes.json` in `public/` and a dynamic loader that injects `remoteEntry` scripts before mounting the app to allow independent deployments.
- Suggested runtime file: [public/remotes.json](public/remotes.json) (update or copy this file as part of your deployment pipeline).

## Authentication

- Implementation: OIDC-compatible; the code uses `react-oidc-context` and `oidc-client-ts` to manage sessions and tokens.
- Routes / callbacks: the provider expects a `redirect_uri` (default `window.location.origin + '/signin-callback'`) — register this URL in your OIDC provider.
- Global helper: the shell synchronizes a global `window.RMU_AUTH` helper (token, state, login, logout, profile) to help remotes that don't use hooks integrate easily.

## i18n

- Built-in internationalization (i18n) support.
- Translations files are loaded at runtime from an external service in JSON format.

## Rules and best practices

- All the code will be in English
- The components will use TypeScript
