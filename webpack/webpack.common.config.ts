import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import { Configuration } from 'webpack';

// Constants
import { APP_TITLE, BUILD_PATH, SRC_PATH } from './constants';

const config: Configuration = {
  entry: {
    ['agora-wallet']: resolve(SRC_PATH, 'agora-wallet.ts'),
    ['background']: resolve(SRC_PATH, 'background.ts'),
    ['content-script']: resolve(SRC_PATH, 'content-script.ts'),
    ['connect']: resolve(SRC_PATH, 'connect.ts'),
    ['main']: resolve(SRC_PATH, 'main.ts'),
    ['register']: resolve(SRC_PATH, 'register.ts'),
  },
  module: {
    rules: [
      {
        loader: 'handlebars-loader',
        test: /\.hbs$/,
      },
      {
        test: /\.(svg?.+|ttf?.+|woff?.+|woff2?.+)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[hash][ext][query]',
        },
      },
    ],
  },
  output: {
    clean: true,
    filename: '[name].js',
    path: BUILD_PATH,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: resolve(SRC_PATH, 'icons'),
          to: resolve(BUILD_PATH, 'icons'),
        },
        {
          from: resolve(SRC_PATH, 'manifest.json'),
        },
        {
          from: resolve(SRC_PATH, 'networks.json'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      chunks: ['connect'],
      filename: 'connect.html',
      inject: 'head',
      template: resolve(SRC_PATH, 'index.hbs'),
      title: APP_TITLE,
    }),
    new HtmlWebpackPlugin({
      chunks: ['main'],
      filename: 'main.html',
      inject: 'head',
      template: resolve(SRC_PATH, 'index.hbs'),
      title: APP_TITLE,
    }),
    new HtmlWebpackPlugin({
      chunks: ['register'],
      filename: 'register.html',
      inject: 'head',
      template: resolve(SRC_PATH, 'index.hbs'),
      title: APP_TITLE,
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
};

export default config;
