import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import { Configuration, DefinePlugin } from 'webpack';
import { Configuration as DevelopmentConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';

// Config
import { version } from '../package.json';
import { browser_specific_settings } from '../src/manifest.json';
import commonConfig from './webpack.common.config';

// Constants
import {
  APP_TITLE,
  DEVELOPMENT_ENVIRONMENT,
  DAPP_ENVIRONMENT,
  DAPP_BUILD_PATH,
  DAPP_SRC_PATH,
  PRODUCTION_ENVIRONMENT,
} from './constants';

// Plugins
import WebExtPlugin from './plugins/WebExtPlugin';

const dappPort: number = 8080;

const configs: (Configuration | DevelopmentConfiguration)[] = [
  /**
   * Development
   */
  merge(commonConfig, {
    devtool: 'cheap-module-source-map',
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
      ],
    },
    name: DEVELOPMENT_ENVIRONMENT,
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    },
    output: {
      pathinfo: false,
    },
    plugins: [
      new DefinePlugin({
        __EXTENSION_ID__: JSON.stringify(browser_specific_settings.gecko.id),
        __APP_TITLE__: JSON.stringify(APP_TITLE),
        __ENV__: JSON.stringify(DEVELOPMENT_ENVIRONMENT),
        __VERSION__: JSON.stringify(version),
      }),
      new WebExtPlugin({
        devtools: true,
        persistState: true,
        startUrls: [`http://localhost:${dappPort}`], // navigate to the dapp
      }),
    ],
  }),
  /**
   * Production
   */
  merge(commonConfig, {
    mode: 'production',
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
              },
            },
          ],
        },
      ],
    },
    name: PRODUCTION_ENVIRONMENT,
    plugins: [
      new DefinePlugin({
        __EXTENSION_ID__: JSON.stringify(browser_specific_settings.gecko.id),
        __APP_TITLE__: JSON.stringify(APP_TITLE),
        __ENV__: JSON.stringify(PRODUCTION_ENVIRONMENT),
        __VERSION__: JSON.stringify(version),
      }),
    ],
  }),
  /**
   * Example dApp
   */
  {
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
        ...(commonConfig.module?.rules ? commonConfig.module.rules : []),
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
      ],
    },
    name: DAPP_ENVIRONMENT,
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
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
        title: `${APP_TITLE} DApp Example`,
      }),
    ],
    resolve: commonConfig.resolve,
  },
];

export default configs;
