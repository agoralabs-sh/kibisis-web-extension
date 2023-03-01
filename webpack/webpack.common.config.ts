import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import { Configuration } from 'webpack';

// Constants
import { APP_TITLE, BUILD_PATH, SRC_PATH } from './constants';

const config: Configuration = {
  entry: {
    ['resources/agora-wallet']: resolve(
      SRC_PATH,
      'resources',
      'agora-wallet.ts'
    ),
    ['resources/content']: resolve(SRC_PATH, 'resources', 'content.ts'),
    ['popup/index']: resolve(SRC_PATH, 'popup', 'index.ts'),
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
      chunks: ['popup/index'],
      filename: 'popup/popup.html',
      inject: 'head',
      template: resolve(SRC_PATH, 'popup', 'index.hbs'),
      title: APP_TITLE,
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
};

export default config;
