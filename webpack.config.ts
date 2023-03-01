import { resolve } from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  entry: resolve(__dirname, 'src', 'content-script.ts'),
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
              configFile: resolve(__dirname, 'tsconfig.json'),
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: 'agora-wallet.js',
    path: resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
};

export default config;
