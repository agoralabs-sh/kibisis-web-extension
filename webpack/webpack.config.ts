import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';

// Config
import commonConfig from './webpack.common.config';

// Plugins
import WebExtPlugin from './plugins/WebExtPlugin';

const configs: Configuration[] = [
  merge(commonConfig, {
    devtool: 'cheap-module-source-map',
    mode: 'development',
    name: 'development',
    plugins: [new WebExtPlugin()],
  }),
  merge(commonConfig, {
    mode: 'production',
    name: 'production',
    output: {
      clean: true,
    },
  }),
];

export default configs;
