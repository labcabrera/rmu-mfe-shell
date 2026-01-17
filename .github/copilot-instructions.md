# Copilot instructions — rmu-mfe-shell

This file gives focused, actionable guidance for AI coding agents working on this repo.

Goals: get code running locally, understand Module Federation points, and automate builds/deploys.

Key entry points

- `package.json`: contains scripts — use `npm ci`, `npm run start` (dev), `npm run build` (prod), `npm run build:start` (serve `dist/`).
- `webpack.config.js`: main build/dev configuration. Public path comes from `RMU_FE_HOST_PUBLIC_PATH`; dev server host uses `RMU_FE_HOST`.
- `src/index.js` and `src/Bootstrap.tsx`: app entry and mount logic. Ensure remote loaders complete before mounting if you change bootstrap behavior.
- `dist/` is the production output (copied from `public/` + webpack output).

Module Federation specifics

- `webpack.config.js` contains `ModuleFederationPlugin` with `remotes` defined (e.g. `core`, `strategic`, `tactical`, `npcs`). When changing remotes:
  - Build-time: update `remotes` value to the hosted `remoteEntry` URL (or set env vars `RMU_MODULE_FEDERATION_*`).
  - Recommended: use runtime `remotes.json` (hosted in S3) and a dynamic loader that injects `remoteEntry` scripts before `Bootstrap` mounts.

Dev server and proxies

- Dev server runs on port 8080. Proxies forward `/dev/api/*` paths to local backend ports (3001,3002,3003,3006,3008) and inject `Authorization: Bearer ${TOKEN}`.
- For local dev, set `TOKEN` env var or remove proxy auth. Example:
  ```bash
  export TOKEN="your-jwt"
  npm run start
  ```

Build & deploy (what actually works in this repo)

- Build production: `npm run build` -> `dist/` created.
- Quick local serve: `npm run build:start` (uses `serve` in `dist/`).
- Deploy to S3/CloudFront: repo contains `aws/` artifacts and docs (`aws/aws.adoc`, `aws/cloudfront-distribution.json`, `aws/route53-change.json`). Follow those steps. Useful commands from docs:
  - Sync: `aws s3 sync dist/ s3://rmu-mfe-shell-build/ --delete --exclude index.html --cache-control "max-age=31536000,public"`
  - Upload index: `aws s3 cp dist/index.html s3://rmu-mfe-shell-build/index.html --cache-control "no-cache, no-store, must-revalidate"`
  - Invalidate CloudFront: `aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/index.html" "/remotes.json"`

Project conventions & gotchas

- Public path: when deploying behind CloudFront set `RMU_FE_HOST_PUBLIC_PATH` to the CDN base URL so runtime assets resolve correctly.
- Module federation remotes use absolute URLs in prod — avoid hardcoding local URLs in production builds.
- `copy-webpack-plugin` copies `public/` into `dist/` — any static asset or `remotes.json` should be placed in `public/` to be included in builds.
- The repo uses MUI v7 and React 19; `postinstall` writes module package.json shim for MUI ESM compatibility — do not remove.

Testing & linting

- Jest is available (`jest` in `devDependencies`) but repo has no tests currently. Run: `npx jest`.
- ESLint + Prettier configured — run `npx eslint .` and `npx prettier --check .`.

When editing infra files

- `aws/cloudfront-distribution.json` is a template; use the `jq` snippet in `aws/aws.adoc` to inject `OriginAccessControlId`, `DomainName`, and a unique `CallerReference` before calling `aws cloudfront create-distribution`.
- Do not set S3 bucket public. Use the bucket policy pattern in `aws/aws.adoc` and OAC (Origin Access Control) for secure CloudFront access.

If you modify bootstrap or remote loading

- Update `src/Bootstrap.tsx` to delay React mount until remotes are loaded. See `ModuleFederationPlugin.remotes` in `webpack.config.js` and keep `StrictMode`/`BrowserRouter` wrapping unchanged.

Quick checklist for PRs that touch build/deploy

- Run `npm ci && npm run build` and verify `dist/` contains `index.html` and expected hashed assets.
- Ensure `public/remotes.json` or equivalent is updated and not cached (use cache-control no-cache on remotes.json upload).
- Update `aws/` docs or templates if distribution, bucket name, or OAC ids changed.

Questions / missing info for agents

- Node runtime recommendation (exact version) is not pinned — prefer Node 18+.
- CI secrets and CloudFront distribution id are stored outside repo; request them from repo owner when creating workflows.

If anything here is unclear or you'd like examples added (runtime remote loader, full GitHub Actions deploy workflow), say which piece and I'll add it.
