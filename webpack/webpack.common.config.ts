import CopyPlugin from 'copy-webpack-plugin';
import { resolve } from 'path';
import { Configuration } from 'webpack';

const buildDir: string = resolve(process.cwd(), 'build');
const srcDir: string = resolve(process.cwd(), 'src');

const config: Configuration = {
  entry: {
    ['agora-wallet']: resolve(srcDir, 'content-script.ts'),
  },
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
  output: {
    filename: '[name].js',
    path: buildDir,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: resolve(srcDir, 'icons'),
          to: resolve(buildDir, 'icons'),
        },
        {
          from: resolve(srcDir, 'manifest.json'),
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
};

export default config;
