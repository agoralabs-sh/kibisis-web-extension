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
    ['onboard']: resolve(SRC_PATH, 'onboard.ts'),
    ['popup']: resolve(SRC_PATH, 'popup.ts'),
  },
  module: {
    rules: [
      {
        loader: 'handlebars-loader',
        test: /\.hbs$/,
      },
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
      ],
    }),
    new HtmlWebpackPlugin({
      chunks: ['onboard'],
      filename: 'onboard.html',
      inject: 'head',
      template: resolve(SRC_PATH, 'onboard.hbs'),
      title: APP_TITLE,
    }),
    new HtmlWebpackPlugin({
      chunks: ['popup'],
      filename: 'popup.html',
      inject: 'head',
      template: resolve(SRC_PATH, 'popup.hbs'),
      title: APP_TITLE,
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
};

export default config;
