import { merge } from 'webpack-merge';

// Config
import commonConfig from './webpack.common.config';

export default merge(commonConfig, {
  mode: 'development',
});
