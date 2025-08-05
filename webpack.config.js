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
      filename: "remoteEntry.js",
      remotes: {
        // strategic: process.env.RMU_MODULE_FEDERATION_STRATEGIC || "strategic@http://localhost:8082/strategic-app.js",
        // tactical: process.env.RMU_MODULE_FEDERATION_TACTICAL || "tactical@http://localhost:8083/tactical-app.js",
        // npc: process.env.RMU_MODULE_FEDERATION_NPC || "npc@http://localhost:8084/npc-app.js",

        //strategic: "strategic@http://fe-strategic.rmu.local/strategic-app.js",
        //tactical: "tactical@http://fe-tactical.rmu.local/tactical-app.js",
        //npc: "npc@http://fe-npc.rmu.local/npc-app.js",

        strategic: "strategic@http://localhost:8082/strategic-app.js",
        tactical: "tactical@http://localhost:8083/tactical-app.js",
        npc: "npc@http://localhost:8084/npc-app.js",
      },
      exposes: {
        './theme': './src/theme',
        './auth': './src/auth',
        './AuthContext': './src/contexts/auth-context',
        './AuthService': './src/services/auth-service',
        './UserMenu': './src/components/auth/user-menu',
        './AuthLoader': './src/components/auth/auth-loader',
        './ProtectedRoute': './src/components/auth/protected-route',
        './AuthDebug': './src/components/auth/auth-debug',
        './useApi': './src/hooks/useApi',
        './ApiClient': './src/utils/api-client'
      },
      shared: {
        'react': {
          singleton: true,
          requiredVersion: deps['react'],
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: deps['react-router-dom'],
        },
        '@mui/material': {
          singleton: true,
          requiredVersion: deps['@mui/material'],
        },
        '@mui/icons-material': {
          singleton: true,
          requiredVersion: deps['@mui/icons-material'],
        },
        '@emotion/react': {
          singleton: true,
          requiredVersion: deps['@emotion/react'],
        },
        '@emotion/styled': {
          singleton: true,
          requiredVersion: deps['@emotion/styled'],
        },
        'keycloak-js': {
          singleton: true,
          requiredVersion: deps['keycloak-js'],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      favicon: './src/assets/react.256x228.png'
    }),
    new Dotenv(),
  ],
});
