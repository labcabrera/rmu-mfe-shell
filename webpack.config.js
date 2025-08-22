const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const Dotenv = require("dotenv-webpack");

const deps = require("./package.json").dependencies;

const printCompilationMessage = require("./compilation.config.js");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (_, argv) => ({
  output: {
    //publicPath: process.env.RMU_FE_HOST_PUBLIC_PATH || "http://localhost:8080/",
    //publicPath: process.env.RMU_FE_HOST_PUBLIC_PATH || "http://fe-host.rmu.local/",
    //publicPath: "http://fe-host.rmu.local/",
    publicPath: "http://localhost:8080/"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: "all",
    port: 8080,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, "src")],
    proxy: [
      {
        context: ['/dev/api/strategic'],
        target: 'http://localhost:3002',
        changeOrigin: true,
        pathRewrite: { '^/dev/api/strategic': '' },
        onProxyReq: function(proxyReq, req, res) {
          console.log('[proxy strategic] Redirect:', req.url, '->', proxyReq.getHeader('host'));
          proxyReq.setHeader('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIxSEpkcmJ4ZFpVVVI2YnBNemxZYV95LWFsMUZLY21iYlpfbGVoTFl0cUVFIn0.eyJleHAiOjE3NTU5NTQzMDgsImlhdCI6MTc1NTg2NzkwOCwianRpIjoib25ydHJvOjM2ZDgyNzIwLTU4NTQtNmY0NC0zMzQ1LTQxYjY4Yjk2NWVjYiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA5MC9yZWFsbXMvcm11LWxvY2FsIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjQ4YmM4YTllLWJhNjAtNDAwZi1iYmY0LWVhYWI0OWJjN2YzYSIsInR5cCI6IkJlYXJlciIsImF6cCI6InJtdS1jbGllbnQiLCJzaWQiOiIxYWNmZmFjYy0zNzc2LTRhYTgtYWU3My0wZGE3OTZiZjBhNjciLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiYWRtaW4iLCJ1bWFfYXV0aG9yaXphdGlvbiIsImZhY3Rpb24tbWFuYWdlbWVudCIsImRlZmF1bHQtcm9sZXMtcm11LWxvY2FsIiwicm11LWFkbWluIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJMdWlzIENhYnJlcmEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXQiLCJnaXZlbl9uYW1lIjoiTHVpcyIsImZhbWlseV9uYW1lIjoiQ2FicmVyYSIsImVtYWlsIjoibGFiLmNhYnJlcmFAZ21haWwuY29tIn0.tnRPHLbTg3s6SEPyM5nqMBWRx_v82wodSQtX17Rj9XTdWiHhOilN-wOwxa83j0dP04N04weo0JP8jpjW14ZoDsyJlOjmZCxwU0vSHH1MSTF9FvAtYrjivCgJKNBDdDPmP5bBFeMopmYe5Z-Jbtx-pja_nAsnMLqeH1Im2--StVUdEMH639JSOJ73PwnjjRabU7s_t50id07PF0WL_zQ2oLIJJtdt6Hpc5ZK9thqV7NqZqFMwkox_dIZB58gg-xky-oeLWc7_O0Vs5aP5AcLcxHUZplcu0RNkC4HYhs5kcLXsrSbi1crRSKb7jgD41h7styDang0f7i0aojhUmeNXAA');
        }
      },
      {
        context: ['/dev/api/core'],
        target: 'http://localhost:3001',
        changeOrigin: true,
        pathRewrite: { '^/dev/api/core': '' },
        onProxyReq: function(proxyReq, req, res) {
          console.log('[proxy core] Redirect:', req.url, '->', proxyReq.getHeader('host'));
          proxyReq.setHeader('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIxSEpkcmJ4ZFpVVVI2YnBNemxZYV95LWFsMUZLY21iYlpfbGVoTFl0cUVFIn0.eyJleHAiOjE3NTU5NTQzMDgsImlhdCI6MTc1NTg2NzkwOCwianRpIjoib25ydHJvOjM2ZDgyNzIwLTU4NTQtNmY0NC0zMzQ1LTQxYjY4Yjk2NWVjYiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA5MC9yZWFsbXMvcm11LWxvY2FsIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjQ4YmM4YTllLWJhNjAtNDAwZi1iYmY0LWVhYWI0OWJjN2YzYSIsInR5cCI6IkJlYXJlciIsImF6cCI6InJtdS1jbGllbnQiLCJzaWQiOiIxYWNmZmFjYy0zNzc2LTRhYTgtYWU3My0wZGE3OTZiZjBhNjciLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiYWRtaW4iLCJ1bWFfYXV0aG9yaXphdGlvbiIsImZhY3Rpb24tbWFuYWdlbWVudCIsImRlZmF1bHQtcm9sZXMtcm11LWxvY2FsIiwicm11LWFkbWluIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJMdWlzIENhYnJlcmEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXQiLCJnaXZlbl9uYW1lIjoiTHVpcyIsImZhbWlseV9uYW1lIjoiQ2FicmVyYSIsImVtYWlsIjoibGFiLmNhYnJlcmFAZ21haWwuY29tIn0.tnRPHLbTg3s6SEPyM5nqMBWRx_v82wodSQtX17Rj9XTdWiHhOilN-wOwxa83j0dP04N04weo0JP8jpjW14ZoDsyJlOjmZCxwU0vSHH1MSTF9FvAtYrjivCgJKNBDdDPmP5bBFeMopmYe5Z-Jbtx-pja_nAsnMLqeH1Im2--StVUdEMH639JSOJ73PwnjjRabU7s_t50id07PF0WL_zQ2oLIJJtdt6Hpc5ZK9thqV7NqZqFMwkox_dIZB58gg-xky-oeLWc7_O0Vs5aP5AcLcxHUZplcu0RNkC4HYhs5kcLXsrSbi1crRSKb7jgD41h7styDang0f7i0aojhUmeNXAA');
        }
      }
    ],
    onListening: function (devServer) {
      const port = devServer.server.address().port;
      printCompilationMessage("compiling", port);
      devServer.compiler.hooks.done.tap("OutputMessagePlugin", (stats) => {
        setImmediate(() => {
          if (stats.hasErrors()) {
            printCompilationMessage("failure", port);
          } else {
            printCompilationMessage("success", port);
          }
        });
      });
    },
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|jfif)$/i,
        use: ["file-loader"],
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
          from: path.resolve(__dirname, "public"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
    new ModuleFederationPlugin({
      name: "host",
      filename: "host.js",
      remotes: {
        // strategic: process.env.RMU_MODULE_FEDERATION_STRATEGIC || "strategic@http://localhost:8082/strategic-app.js",
        // tactical: process.env.RMU_MODULE_FEDERATION_TACTICAL || "tactical@http://localhost:8083/tactical-app.js",
        // npc: process.env.RMU_MODULE_FEDERATION_NPC || "npc@http://localhost:8084/npc-app.js",

        //strategic: "strategic@http://fe-strategic.rmu.local/strategic-app.js",
        //tactical: "tactical@http://fe-tactical.rmu.local/tactical-app.js",
        //npc: "npc@http://fe-npc.rmu.local/npc-app.js",

        core: "core@http://localhost:8010/core-app.js",
        strategic: "strategic@http://localhost:8082/strategic-app.js",
        tactical: "tactical@http://localhost:8083/tactical-app.js",
        npc: "npc@http://localhost:8084/npc-app.js",
      },
      exposes: {
      },
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps["react-dom"] },
        'react-router-dom': { singleton: true, requiredVersion: deps["react-router-dom"] },
        '@mui/material': { singleton: true, requiredVersion: deps["@mui/material"] },
        '@mui/icons-material': { singleton: true, requiredVersion: deps["@mui/icons-material"] },
        '@emotion/react': { singleton: true, requiredVersion: deps["@emotion/react"] },
        '@emotion/styled': { singleton: true, requiredVersion: deps["@emotion/styled"] },

      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      favicon: './src/assets/react.256x228.png'
    }),
    new Dotenv(),
  ],
});
