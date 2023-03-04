import { Configuration, DefinePlugin } from 'webpack';
import { merge } from 'webpack-merge';

// Config
import { version } from '../package.json';
import commonConfig from './webpack.common.config';

// Constants
import { DEVELOPMENT_ENVIRONMENT, PRODUCTION_ENVIRONMENT } from './constants';

// Plugins
import WebExtPlugin from './plugins/WebExtPlugin';

const configs: Configuration[] = [
  merge(commonConfig, {
    devtool: 'cheap-module-source-map',
    mode: 'development',
    name: DEVELOPMENT_ENVIRONMENT,
    plugins: [
      new DefinePlugin({
        __ENV__: JSON.stringify(DEVELOPMENT_ENVIRONMENT),
        __VERSION__: JSON.stringify(version),
      }),
      new WebExtPlugin({
        devtools: true,
      }),
    ],
  }),
  merge(commonConfig, {
    mode: 'production',
    name: PRODUCTION_ENVIRONMENT,
    plugins: [
      new DefinePlugin({
        __ENV__: JSON.stringify(PRODUCTION_ENVIRONMENT),
        __VERSION__: JSON.stringify(version),
      }),
    ],
  }),
];

export default configs;
