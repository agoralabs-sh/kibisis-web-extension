import CopyPlugin from 'copy-webpack-plugin';
import { config } from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import { Configuration, DefinePlugin, RuleSetRule } from 'webpack';
import { Configuration as DevelopmentConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';

// config
import { version } from '../package.json';

// enums
import { ConfigNameEnum, EnvironmentEnum, TargetEnum } from './enums';

// constants
import {
  APP_TITLE,
  CHROME_BUILD_PATH,
  DAPP_BUILD_PATH,
  DAPP_SRC_PATH,
  EDGE_BUILD_PATH,
  FIREFOX_BUILD_PATH,
  SRC_PATH,
} from './constants';

// plugins
import ManifestBuilderPlugin from './plugins/ManifestBuilderPlugin';
import WebExtPlugin from './plugins/WebExtPlugin';

// types
import { IWebpackEnvironmentVariables } from './types';

// utils
import { createCommonConfig } from './utils';

const configs: (
  env: IWebpackEnvironmentVariables
) => (Configuration | DevelopmentConfiguration)[] = ({
  environment = EnvironmentEnum.Development,
  target = TargetEnum.Firefox,
}: IWebpackEnvironmentVariables) => {
  let buildPath: string;
  let commonConfig: Configuration;
  let dappPort: number;
  let definePlugin: DefinePlugin;
  let devtool: string | false | undefined;
  let extensionPath: string;
  let fontLoaderRule: RuleSetRule;
  let handleBarsLoaderRule: RuleSetRule;
  let manifestPaths: string[];
  let maxSize: number;
  let optimization: Record<string, unknown>;
  let output: Record<string, unknown>;
  let performance: Record<string, unknown> | false;
  let stylesLoaderRule: RuleSetRule;
  let tsLoaderRule: RuleSetRule;

  // load .env file
  config();

  dappPort = 8080;
  definePlugin = new DefinePlugin({
    __APP_TITLE__: JSON.stringify(APP_TITLE),
    __ENV__: JSON.stringify(environment),
    __TARGET__: JSON.stringify(target),
    __VERSION__: JSON.stringify(version),
    __WALLET_CONNECT_PROJECT_ID__: JSON.stringify(
      process.env.WALLET_CONNECT_PROJECT_ID
    ),
  });
  extensionPath = resolve(SRC_PATH, 'extension');
  fontLoaderRule = {
    test: /\.(svg?.+|ttf?.+|woff?.+|woff2?.+)$/,
    type: 'asset/resource',
    generator: {
      filename: 'assets/[hash][ext][query]',
    },
  };
  handleBarsLoaderRule = {
    loader: 'handlebars-loader',
    test: /\.hbs$/,
  };
  maxSize = 4000000; // 4 MB
  commonConfig = createCommonConfig();
  stylesLoaderRule = {
    test: /\.css$/i,
    use: [
      {
        loader: 'style-loader',
        options: {
          injectType: 'styleTag',
        },
      },
      {
        loader: 'css-loader',
        options: {
          url: true,
        },
      },
    ],
  };

  switch (target) {
    case TargetEnum.Chrome:
      buildPath = CHROME_BUILD_PATH;
      manifestPaths = [
        resolve(SRC_PATH, 'manifest.common.json'),
        resolve(SRC_PATH, `manifest.v3.json`),
      ];
      break;
    case TargetEnum.Edge:
      buildPath = EDGE_BUILD_PATH;
      manifestPaths = [
        resolve(SRC_PATH, 'manifest.common.json'),
        resolve(SRC_PATH, `manifest.v3.json`),
      ];
      break;
    // default to firefox
    case TargetEnum.Firefox:
    default:
      buildPath = FIREFOX_BUILD_PATH;
      manifestPaths = [
        resolve(SRC_PATH, 'manifest.common.json'),
        resolve(SRC_PATH, `manifest.v2.json`),
        resolve(SRC_PATH, `manifest.firefox.json`),
      ];
      break;
  }

  switch (environment) {
    case EnvironmentEnum.Production:
      devtool = 'source-map';
      optimization = {
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: 'all',
              maxSize,
              name: 'vendor',
              reuseExistingChunk: true,
              test: /[\\/]node_modules[\\/]/,
            },
          },
        },
      };
      output = {
        filename: '[name].js',
        path: buildPath,
      };
      performance = {
        hints: 'warning',
        maxAssetSize: maxSize,
        maxEntrypointSize: 10000000, // 10 MB
      };
      tsLoaderRule = {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: resolve(process.cwd(), 'tsconfig.json'),
            },
          },
        ],
      };
      break;
    // default to development
    case EnvironmentEnum.Development:
    default:
      devtool = 'cheap-module-source-map';
      optimization = {
        removeAvailableModules: true,
        removeEmptyChunks: true,
        splitChunks: false,
      };
      output = {
        filename: '[name].js',
        path: buildPath,
        pathinfo: false,
      };
      performance = false;
      tsLoaderRule = {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: resolve(process.cwd(), 'tsconfig.json'),
              transpileOnly: true,
            },
          },
        ],
      };
      break;
  }

  return [
    /**
     * background, content & injected scripts and the manifest.json file
     */
    merge(commonConfig, {
      devtool,
      entry: {
        ['background']: resolve(SRC_PATH, 'background.ts'),
        ['content-script']: resolve(SRC_PATH, 'content-script.ts'),
        ['wallet-initializer']: resolve(SRC_PATH, 'wallet-initializer.ts'),
      },
      mode: environment,
      module: {
        rules: [tsLoaderRule],
      },
      name: ConfigNameEnum.ExtensionScripts,
      optimization: {
        removeAvailableModules: true,
        removeEmptyChunks: true,
        splitChunks: false, // extension scripts need to have dependencies bundled
      },
      output: {
        ...output,
        clean: true,
      },
      plugins: [definePlugin, new ManifestBuilderPlugin(...manifestPaths)],
    }),

    /**
     * extension apps
     */
    merge(commonConfig, {
      dependencies: [ConfigNameEnum.ExtensionScripts],
      devtool,
      entry: {
        ['background-app']: resolve(
          extensionPath,
          'apps',
          'background',
          'index.ts'
        ),
        ['main-app']: resolve(extensionPath, 'apps', 'main', 'index.ts'),
        ['registration-app']: resolve(
          extensionPath,
          'apps',
          'registration',
          'index.ts'
        ),
      },
      mode: environment,
      module: {
        rules: [
          tsLoaderRule,
          stylesLoaderRule,
          handleBarsLoaderRule,
          fontLoaderRule,
        ],
      },
      name: ConfigNameEnum.ExtensionApps,
      optimization,
      output,
      performance,
      plugins: [
        new CopyPlugin({
          patterns: [
            {
              from: resolve(SRC_PATH, 'documents'),
              to: resolve(buildPath, 'documents'),
            },
            {
              from: resolve(SRC_PATH, 'icons'),
              to: resolve(buildPath, 'icons'),
            },
          ],
        }),
        definePlugin,
        new HtmlWebpackPlugin({
          chunks: ['background-app'],
          filename: 'background-app.html',
          inject: 'head',
          template: resolve(SRC_PATH, 'index.hbs'),
          title: APP_TITLE,
        }),
        new HtmlWebpackPlugin({
          chunks: ['main-app'],
          filename: 'main-app.html',
          inject: 'head',
          template: resolve(SRC_PATH, 'index.hbs'),
          title: APP_TITLE,
        }),
        new HtmlWebpackPlugin({
          chunks: ['registration-app'],
          filename: 'registration-app.html',
          inject: 'head',
          template: resolve(SRC_PATH, 'index.hbs'),
          title: APP_TITLE,
        }),
        ...(environment === EnvironmentEnum.Development &&
        (target === TargetEnum.Chrome || target === TargetEnum.Firefox)
          ? [
              new WebExtPlugin({
                buildPath,
                devtools: true,
                persistState: true,
                startUrls: [`http://localhost:${dappPort}`], // navigate to the dapp
                target,
              }),
            ]
          : []),
      ],
    }),

    /**
     * dapp example
     */
    merge(commonConfig, {
      devtool: 'cheap-module-source-map',
      devServer: {
        port: dappPort,
        watchFiles: [`${DAPP_SRC_PATH}/**/*`],
      },
      entry: {
        ['main']: resolve(DAPP_SRC_PATH, 'index.ts'),
      },
      mode: 'development',
      module: {
        rules: [
          {
            exclude: /node_modules/,
            test: /\.tsx?$/,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  configFile: resolve(process.cwd(), 'tsconfig.json'),
                  transpileOnly: true,
                },
              },
            ],
          },
          stylesLoaderRule,
          handleBarsLoaderRule,
          fontLoaderRule,
        ],
      },
      name: ConfigNameEnum.DappExample,
      optimization: {
        removeAvailableModules: true,
        removeEmptyChunks: true,
        splitChunks: false,
      },
      output: {
        clean: true,
        filename: '[name].js',
        path: DAPP_BUILD_PATH,
        pathinfo: false,
      },
      plugins: [
        new HtmlWebpackPlugin({
          chunks: ['main'],
          favicon: resolve(DAPP_SRC_PATH, 'favicon.png'),
          filename: 'index.html',
          inject: 'body',
          template: resolve(DAPP_SRC_PATH, 'index.hbs'),
          title: `${APP_TITLE} Dapp Example`,
        }),
      ],
    }),
  ];
};

export default configs;
