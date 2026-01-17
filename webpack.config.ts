import CopyWebpackPlugin from 'copy-webpack-plugin';
import fs from 'fs';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import { Configuration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';

const require_ = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ModuleFederationPlugin = require_('webpack/lib/container/ModuleFederationPlugin');

const deps = require_('./package.json').dependencies;
const printCompilationMessage = require_('./compilation.config.js');

function loadEnv(envFile: string) {
  try {
    require('dotenv').config({ path: envFile });
  } catch (e) {
    try {
      const content = fs.readFileSync(envFile, 'utf8');
      content.split(/\r?\n/).forEach((line) => {
        const m = line.match(/^\s*([A-Za-z0-9_\.\-]+)\s*=\s*(.*)\s*$/);
        if (!m) return;
        let key = m[1];
        let val = m[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        if (process.env[key] === undefined) process.env[key] = val;
      });
    } catch (e2) {
      // ignore
    }
  }
}

export default function (_: any, argv: any): Configuration & { devServer?: DevServerConfiguration } {
  const envFile = argv && argv.mode === 'production' ? '.env.production' : '.env';
  loadEnv(envFile);

  // compute websocket hostname/port for devServer client from an env var
  const wsDefaults = { hostname: 'auto', port: 8080 };
  const wsRaw = process.env.RMU_MFE_SHELL_PUBLIC_PATH || process.env.RMU_FE_HOST || '';
  const wsConfig = ((): { hostname: string; port: number } => {
    if (!wsRaw) return wsDefaults;
    try {
      const u = new URL(wsRaw);
      return { hostname: u.hostname || wsDefaults.hostname, port: u.port ? Number(u.port) : wsDefaults.port };
    } catch (e) {
      // fallback: strip protocol and trailing slash
      const stripped = wsRaw.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const [h, p] = stripped.split(':');
      return { hostname: h || wsDefaults.hostname, port: p ? Number(p) : wsDefaults.port };
    }
  })();

  return {
    output: {
      publicPath: process.env.RMU_MFE_SHELL_PUBLIC_PATH || '/',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    },
    devServer: {
      host: '0.0.0.0',
      historyApiFallback: true,
      allowedHosts: 'all',
      port: 8080,
      watchFiles: [path.resolve(__dirname, 'src')],
      client: {
        webSocketURL: {
          hostname: wsConfig.hostname,
          port: wsConfig.port,
        },
      },
      proxy: [
        {
          context: ['/dev/api/core'],
          target: 'http://localhost:3001',
          changeOrigin: true,
          pathRewrite: { '^/dev/api/core': '' },
          onProxyReq: function (proxyReq: any, req: any, res: any) {
            console.log('[proxy core] Redirect:', req.url, '->', proxyReq.getHeader('host'));
            proxyReq.setHeader('Authorization', `Bearer ${process.env.TOKEN}`);
          },
        },
        {
          context: ['/dev/api/strategic'],
          target: 'http://localhost:3002',
          changeOrigin: true,
          pathRewrite: { '^/dev/api/strategic': '' },
          onProxyReq: function (proxyReq: any, req: any, res: any) {
            console.log('[proxy strategic] Redirect:', req.url, '->', proxyReq.getHeader('host'));
            proxyReq.setHeader('Authorization', `Bearer ${process.env.TOKEN}`);
          },
        },
        {
          context: ['/dev/api/tactical'],
          target: 'http://localhost:3003',
          changeOrigin: true,
          pathRewrite: { '^/dev/api/tactical': '' },
          onProxyReq: function (proxyReq: any, req: any, res: any) {
            console.log('[proxy tactical] Redirect:', req.url, '->', proxyReq.getHeader('host'));
            proxyReq.setHeader('Authorization', `Bearer ${process.env.TOKEN}`);
          },
        },
        {
          context: ['/dev/api/items'],
          target: 'http://localhost:3006',
          changeOrigin: true,
          pathRewrite: { '^/dev/api/items': '' },
          onProxyReq: function (proxyReq: any, req: any, res: any) {
            console.log('[proxy items] Redirect:', req.url, '->', proxyReq.getHeader('host'));
            proxyReq.setHeader('Authorization', `Bearer ${process.env.TOKEN}`);
          },
        },
        {
          context: ['/dev/api/npcs'],
          target: 'http://localhost:3008',
          changeOrigin: true,
          pathRewrite: { '^/dev/api/npcs': '' },
          onProxyReq: function (proxyReq: any, req: any, res: any) {
            console.log('[proxy npcs] Redirect:', req.url, '->', proxyReq.getHeader('host'));
            proxyReq.setHeader('Authorization', `Bearer ${process.env.TOKEN}`);
          },
        },
      ],
      onListening: function (devServer: any) {
        const port = devServer.server.address().port;
        printCompilationMessage('compiling', port);
        devServer.compiler.hooks.done.tap('OutputMessagePlugin', (stats: any) => {
          setImmediate(() => {
            if (stats.hasErrors()) {
              printCompilationMessage('failure', port);
            } else {
              printCompilationMessage('success', port);
            }
          });
        });
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
          core: `core@${process.env.RMU_MFE_CORE_PUBLIC_PATH}core-app.js`,
          strategic: `strategic@${process.env.RMU_MFE_STRATEGIC_PUBLIC_PATH}strategic-app.js`,
          tactical: `tactical@${process.env.RMU_MFE_TACTICAL_PUBLIC_PATH}tactical-app.js`,
          npcs: `npcs@${process.env.RMU_MFE_NPCS_PUBLIC_PATH}npcs-app.js`,
        },
        exposes: {},
        shared: {
          react: { singleton: true, requiredVersion: deps.react },
          'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
          'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
          '@mui/material': { singleton: true, requiredVersion: deps['@mui/material'] },
          '@mui/icons-material': { singleton: true, requiredVersion: deps['@mui/icons-material'] },
          '@emotion/react': { singleton: true, requiredVersion: deps['@emotion/react'] },
          '@emotion/styled': { singleton: true, requiredVersion: deps['@emotion/styled'] },
        },
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
        favicon: './src/assets/react.256x228.png',
      }),
    ],
  };
}
