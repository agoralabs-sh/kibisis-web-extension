import { resolve } from 'path';
import { Configuration } from 'webpack';

// constants
import { SRC_PATH } from '../constants';

/**
 * Creates a common config.
 * @returns {Configuration} a common configuration.
 */
export default function createCommonConfig(): Configuration {
  const commonPath: string = resolve(SRC_PATH, 'common');
  const extensionPath: string = resolve(SRC_PATH, 'extension');
  const externalPath: string = resolve(SRC_PATH, 'external');

  return {
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
