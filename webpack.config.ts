import CopyWebpackPlugin from 'copy-webpack-plugin';
import dotenv from 'dotenv';
import fs from 'fs';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Configuration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';

const require_ = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ModuleFederationPlugin = require_('webpack/lib/container/ModuleFederationPlugin');
const { DefinePlugin } = require_('webpack');

const deps = require_('./package.json').dependencies;

// Runtime configuration. The keys listed in public/env-config.template.js are not baked into the
// bundle: every `process.env.<KEY>` is rewritten to read window.__RMU_CONFIG__, which env-config.js
// sets before the bundle runs. The remotes read the same object, so it also carries their keys.
// The Docker image renders the template with envsubst; the dev server serves the same keys from .env.
const envConfigTemplate = fs.readFileSync(path.resolve(__dirname, 'public/env-config.template.js'), 'utf8');
const runtimeConfigKeys = Array.from(envConfigTemplate.matchAll(/\$\{([A-Z0-9_]+)\}/g), (match) => match[1]);
const runtimeConfigDefines = Object.fromEntries(
  runtimeConfigKeys.map((key) => [`process.env.${key}`, `(window.__RMU_CONFIG__ || {})[${JSON.stringify(key)}]`])
);
const renderEnvConfig = (): string =>
  `window.__RMU_CONFIG__ = ${JSON.stringify(Object.fromEntries(runtimeConfigKeys.map((key) => [key, process.env[key] ?? ''])))};\n`;

// A remote is located at runtime from RMU_MFE_<NAME>_PUBLIC_PATH (trailing slash, for example
// /mfe/core/). If it cannot be loaded, the import rejects and App.tsx renders a fallback for that
// route only.
const runtimeRemote = (name: string): string => {
  const key = `RMU_MFE_${name.toUpperCase()}_PUBLIC_PATH`;
  return `promise new Promise((resolve, reject) => {
    const base = (window.__RMU_CONFIG__ || {})[${JSON.stringify(key)}];
    if (!base) {
      reject(new Error(${JSON.stringify(`${key} is not configured`)}));
      return;
    }
    const script = document.createElement('script');
    script.src = base + ${JSON.stringify(`${name}-app.js`)};
    script.onload = () => {
      const container = window[${JSON.stringify(name)}];
      if (!container) {
        reject(new Error('Remote ${name} did not register its container (' + script.src + ')'));
        return;
      }
      resolve({
        get: (request) => container.get(request),
        init: (scope) => {
          try {
            return container.init(scope);
          } catch (e) {
            // Already initialized.
          }
        },
      });
    };
    script.onerror = () => reject(new Error('Remote ${name} is not available at ' + script.src));
    document.head.appendChild(script);
  })`;
};

export default function (_: any, argv: any): Configuration & { devServer?: DevServerConfiguration } {
  const mode: string | undefined = argv && argv.mode;
  // `.env.<mode>` overrides the shared `.env` (dotenv keeps the first value it finds).
  const envFile = path.resolve(__dirname, `.env.${mode}`);
  const defaultEnvFile = path.resolve(__dirname, '.env');
  dotenv.config({ path: [envFile, defaultEnvFile], quiet: true });

  const port = process.env.PORT ? Number(process.env.PORT) : 8080;

  return {
    output: {
      // The shell is always served at the root of its origin (the gateway, or the dev server).
      publicPath: '/',
      devtoolNamespace: 'shell',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      // rmu-react-shared-lib is a file: link outside this folder: resolve its peer dependencies (react,
      // MUI…) from this app first so the bundle has a single copy of each.
      modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    },
    devServer: {
      allowedHosts: 'all',
      host: '0.0.0.0',
      port: port,
      historyApiFallback: true,
      watchFiles: [path.resolve(__dirname, 'src')],
      // The page is usually served by the gateway (http://localhost), so HMR connects straight to the dev server.
      client: {
        webSocketURL: `ws://localhost:${port}/ws`,
      },
      setupMiddlewares: (middlewares, devServer) => {
        devServer.app?.get('/env-config.js', (_req, res) => {
          res.type('application/javascript').send(renderEnvConfig());
        });
        return middlewares;
      },
    },
    module: {
      rules: [
        {
          test: /\.m?js/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(css|s[ac]ss)$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(ico|jpg|jpeg|png|gif|jfif)$/i,
          use: ['file-loader'],
        },
        {
          test: /\.ttf$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name][ext]',
          },
        },
      ],
    },
    plugins: [
      new DefinePlugin(runtimeConfigDefines),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public'),
            to: path.resolve(__dirname, 'dist'),
          },
        ],
      }),
      new ModuleFederationPlugin({
        name: 'shell',
        filename: 'shell.js',
        remotes: {
          core: runtimeRemote('core'),
          strategic: runtimeRemote('strategic'),
          tactical: runtimeRemote('tactical'),
          npcs: runtimeRemote('npcs'),
          items: runtimeRemote('items'),
          spells: runtimeRemote('spells'),
        },
        exposes: {
          './i18n': './src/i18n/i18n',
        },
        shared: {
          react: { singleton: true, requiredVersion: deps.react },
          'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
          'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
          '@mui/material': { singleton: true, requiredVersion: deps['@mui/material'] },
          '@mui/icons-material': { singleton: true, requiredVersion: deps['@mui/icons-material'] },
          '@emotion/react': { singleton: true, requiredVersion: deps['@emotion/react'] },
          '@emotion/styled': { singleton: true, requiredVersion: deps['@emotion/styled'] },
          'react-oidc-context': { singleton: true, requiredVersion: deps['react-oidc-context'] },
          'oidc-client-ts': { singleton: true, requiredVersion: deps['oidc-client-ts'] },
          i18next: { singleton: true, requiredVersion: deps.i18next },
          'react-i18next': { singleton: true, requiredVersion: deps['react-i18next'] },
          'i18next-http-backend': { singleton: true, requiredVersion: deps['i18next-http-backend'] },
        },
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
        favicon: './src/assets/react.256x228.png',
      }),
    ],
  };
}
