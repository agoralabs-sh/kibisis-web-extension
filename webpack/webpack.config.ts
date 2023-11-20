import { config } from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import { Configuration } from 'webpack';
import { Configuration as DevelopmentConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';

// config
import { version } from '../package.json';

// enums
import { EnvironmentEnum } from './enums';

// constants
import {
  APP_TITLE,
  DAPP_CONFIG_NAME,
  DAPP_BUILD_PATH,
  DAPP_SRC_PATH,
} from './constants';

// plugins
import WebExtPlugin from './plugins/WebExtPlugin';

// types
import { IWebpackEnvironmentVariables } from './types';

// utils
import { createCommonConfig, createDefinePlugin } from './utils';

const dappPort: number = 8080;
const maxSize: number = 4000000; // 4 MB

const configs: (
  env: IWebpackEnvironmentVariables
) => (Configuration | DevelopmentConfiguration)[] = ({
  target = 'firefox', // default to firefox
}: IWebpackEnvironmentVariables) => {
  let commonConfig: Configuration;

  config();

  commonConfig = createCommonConfig({
    target,
  });

  return [
    /**
     * development
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
      name: EnvironmentEnum.Development,
      optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      },
      output: {
        pathinfo: false,
      },
      plugins: [
        createDefinePlugin({
          environment: EnvironmentEnum.Development,
          target,
          version,
          walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID || '',
        }),
        new WebExtPlugin({
          devtools: true,
          persistState: true,
          startUrls: [`http://localhost:${dappPort}`], // navigate to the dapp
          target,
        }),
      ],
    }),

    /**
     * production
     */
    merge(commonConfig, {
      devtool: false,
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
      name: EnvironmentEnum.Production,
      optimization: {
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
        runtimeChunk: {
          name: 'runtime',
        },
      },
      performance: {
        hints: 'warning',
        maxAssetSize: maxSize,
        maxEntrypointSize: 10000000, // 10 MB
      },
      plugins: [
        createDefinePlugin({
          environment: EnvironmentEnum.Production,
          target,
          version,
          walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID || '',
        }),
      ],
    }),

    /**
     * example dapp
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
      name: DAPP_CONFIG_NAME,
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
};

export default configs;
