import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import { Configuration } from 'webpack';

// constants
import {
  APP_TITLE,
  CHROME_BUILD_PATH,
  FIREFOX_BUILD_PATH,
  SRC_PATH,
} from '../constants';

// plugins
import ManifestBuilderPlugin from '../plugins/ManifestBuilderPlugin';

// types
import { ITargetType } from '../types';

interface IOptions {
  target: ITargetType;
}

/**
 * Creates a common config.
 * @param {IOptions} options - various options to alter the configuration.
 * @returns {Configuration} a common configuration.
 */
export default function createCommonConfig({
  target,
}: IOptions): Configuration {
  const commonPath: string = resolve(SRC_PATH, 'common');
  const extensionPath: string = resolve(SRC_PATH, 'extension');
  const externalPath: string = resolve(SRC_PATH, 'external');
  let buildPath: string = FIREFOX_BUILD_PATH;

  switch (target) {
    case 'chrome':
      buildPath = CHROME_BUILD_PATH;
      break;
    case 'firefox':
    default:
      break;
  }

  return {
    entry: {
      // injected scripts
      ['wallet-initializer']: resolve(SRC_PATH, 'wallet-initializer.ts'),
      ['background']: resolve(SRC_PATH, 'background.ts'),
      ['content-script']: resolve(SRC_PATH, 'content-script.ts'),
      // extension apps
      ['background-app']: resolve(
        extensionPath,
        'apps',
        'background',
        'index.ts'
      ),
      ['main-app']: resolve(extensionPath, 'apps', 'main', 'index.ts'),
      ['registration-app']: resolve(
        extensionPath,
        'apps',
        'registration',
        'index.ts'
      ),
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
      path: buildPath,
    },

    plugins: [
      //assets
      new CopyPlugin({
        patterns: [
          {
            from: resolve(SRC_PATH, 'documents'),
            to: resolve(buildPath, 'documents'),
          },
          {
            from: resolve(SRC_PATH, 'icons'),
            to: resolve(buildPath, 'icons'),
          },
        ],
      }),
      new ManifestBuilderPlugin(
        resolve(SRC_PATH, 'manifest.common.json'),
        resolve(SRC_PATH, `manifest.${target}.json`)
      ),
      // htmls
      new HtmlWebpackPlugin({
        chunks: ['background-app'],
        filename: 'background-app.html',
        inject: 'head',
        template: resolve(SRC_PATH, 'index.hbs'),
        title: APP_TITLE,
      }),
      new HtmlWebpackPlugin({
        chunks: ['main-app'],
        filename: 'main-app.html',
        inject: 'head',
        template: resolve(SRC_PATH, 'index.hbs'),
        title: APP_TITLE,
      }),
      new HtmlWebpackPlugin({
        chunks: ['registration-app'],
        filename: 'registration-app.html',
        inject: 'head',
        template: resolve(SRC_PATH, 'index.hbs'),
        title: APP_TITLE,
      }),
    ],

    resolve: {
      alias: {
        // common
        ['@common/enums']: resolve(commonPath, 'enums'),
        ['@common/errors']: resolve(commonPath, 'errors'),
        ['@common/events']: resolve(commonPath, 'events'),
        ['@common/types']: resolve(commonPath, 'types'),
        ['@common/utils']: resolve(commonPath, 'utils'),
        // extension
        ['@extension/components']: resolve(extensionPath, 'components'),
        ['@extension/config']: resolve(extensionPath, 'config'),
        ['@extension/constants']: resolve(extensionPath, 'constants'),
        ['@extension/enums']: resolve(extensionPath, 'enums'),
        ['@extension/errors']: resolve(extensionPath, 'errors'),
        ['@extension/features/accounts']: resolve(
          extensionPath,
          'features',
          'accounts'
        ),
        ['@extension/features/assets']: resolve(
          extensionPath,
          'features',
          'assets'
        ),
        ['@extension/features/messages']: resolve(
          extensionPath,
          'features',
          'messages'
        ),
        ['@extension/features/networks']: resolve(
          extensionPath,
          'features',
          'networks'
        ),
        ['@extension/features/registration']: resolve(
          extensionPath,
          'features',
          'registration'
        ),
        ['@extension/features/sessions']: resolve(
          extensionPath,
          'features',
          'sessions'
        ),
        ['@extension/features/settings']: resolve(
          extensionPath,
          'features',
          'settings'
        ),
        ['@extension/features/system']: resolve(
          extensionPath,
          'features',
          'system'
        ),
        ['@extension/features/transactions']: resolve(
          extensionPath,
          'features',
          'transactions'
        ),
        ['@extension/fonts']: resolve(extensionPath, 'fonts'),
        ['@extension/hooks']: resolve(extensionPath, 'hooks'),
        ['@extension/pages']: resolve(extensionPath, 'pages'),
        ['@extension/selectors']: resolve(extensionPath, 'selectors'),
        ['@extension/services']: resolve(extensionPath, 'services'),
        ['@extension/theme']: resolve(extensionPath, 'theme'),
        ['@extension/translations']: resolve(extensionPath, 'translations'),
        ['@extension/types']: resolve(extensionPath, 'types'),
        ['@extension/utils']: resolve(extensionPath, 'utils'),
        // external
        ['@external/constants']: resolve(externalPath, 'constants'),
        ['@external/services']: resolve(externalPath, 'services'),
        ['@external/types']: resolve(externalPath, 'types'),
      },

      extensions: ['.js', '.ts', '.tsx'],
    },

    stats: {
      assetsSpace: 100,
      modules: false,
    },
  };
}
