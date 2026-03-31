import CopyWebpackPlugin from 'copy-webpack-plugin';
import dotenv from 'dotenv';
import Dotenv from 'dotenv-webpack';
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

const deps = require_('./package.json').dependencies;
const printCompilationMessage = require_('./compilation.config.js');

export default function (_: any, argv: any): Configuration & { devServer?: DevServerConfiguration } {
  const mode: string | undefined = argv && argv.mode;
  dotenv.config({ path: path.resolve(__dirname, `.env.${mode}`) });

  const publicPath = process.env.RMU_MFE_SHELL_PUBLIC_PATH;
  const port = process.env.PORT ? Number(process.env.PORT) : 8080;
  let wsHostnameResolved: string | undefined;
  let wsProtocol: string | undefined;
  let wsPathname: string | undefined;
  if (process.env.RMU_MFE_SHELL_PUBLIC_PATH) {
    try {
      const parsed = new URL(process.env.RMU_MFE_SHELL_PUBLIC_PATH);
      wsHostnameResolved = parsed.hostname;
      wsProtocol = parsed.protocol === 'https:' ? 'wss' : parsed.protocol === 'http:' ? 'ws' : parsed.protocol.replace(':', '');
      if (parsed.pathname && parsed.pathname !== '/') wsPathname = parsed.pathname;
    } catch (e) {
      wsHostnameResolved = process.env.RMU_MFE_SHELL_PUBLIC_PATH;
    }
  }

  return {
    output: {
      publicPath: publicPath,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    },
    devServer: {
      allowedHosts: 'all',
      host: '0.0.0.0',
      port: port,
      historyApiFallback: true,
      watchFiles: [path.resolve(__dirname, 'src')],
      client: {
        webSocketURL: {
          hostname: wsHostnameResolved,
          port: port,
          protocol: wsProtocol,
          pathname: wsPathname,
        },
      },
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
      new Dotenv({ systemvars: true }),
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
          items: `items@${process.env.RMU_MFE_ITEMS_PUBLIC_PATH}items-app.js`,
          spells: `spells@${process.env.RMU_MFE_SPELLS_PUBLIC_PATH}spells-app.js`,
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
